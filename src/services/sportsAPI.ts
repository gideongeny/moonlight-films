// Live Sports API Integration
// Using multiple free sports APIs for real-time data

import axios from "axios";
import { SportsFixtureConfig } from "../shared/constants";

// API-Football (RapidAPI) - Free tier available
const API_FOOTBALL_BASE = "https://api-football-v1.p.rapidapi.com/v3";
const API_FOOTBALL_KEY = process.env.REACT_APP_API_FOOTBALL_KEY || "";

// TheSportsDB - Free, no key required
const SPORTSDB_BASE = "https://www.thesportsdb.com/api/v1/json/3";

// Get team logo from TheSportsDB
export const getTeamLogo = async (teamName: string): Promise<string | null> => {
  try {
    const response = await axios.get(`${SPORTSDB_BASE}/searchteams.php`, {
      params: { t: teamName },
      timeout: 5000,
    });
    
    if (response.data?.teams && response.data.teams.length > 0) {
      return response.data.teams[0].strTeamBadge || response.data.teams[0].strTeamLogo || null;
    }
    return null;
  } catch (error) {
    console.warn(`Error fetching team logo for ${teamName}:`, error);
    return null;
  }
};

// Get live fixtures from API-Football
export const getLiveFixturesAPI = async (): Promise<SportsFixtureConfig[]> => {
  try {
    // Try API-Football first if key is available
    if (API_FOOTBALL_KEY) {
      const response = await axios.get(`${API_FOOTBALL_BASE}/fixtures`, {
        params: { live: "all" },
        headers: {
          "X-RapidAPI-Key": API_FOOTBALL_KEY,
          "X-RapidAPI-Host": "api-football-v1.p.rapidapi.com",
        },
        timeout: 10000,
      });

      if (response.data?.response) {
        return response.data.response.map((fixture: any) => ({
          id: `live-${fixture.fixture.id}`,
          leagueId: getLeagueIdFromName(fixture.league.name),
          homeTeam: fixture.teams.home.name,
          awayTeam: fixture.teams.away.name,
          homeTeamLogo: fixture.teams.home.logo,
          awayTeamLogo: fixture.teams.away.logo,
          status: "live",
          kickoffTimeFormatted: "Live Now",
          venue: fixture.fixture.venue?.name || "TBD",
          homeScore: fixture.goals.home,
          awayScore: fixture.goals.away,
          minute: fixture.fixture.status?.elapsed ? `${fixture.fixture.status.elapsed}'` : undefined,
          isLive: true,
        }));
      }
    }
  } catch (error) {
    console.warn("API-Football error:", error);
  }

  // Fallback to TheSportsDB
  try {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replaceAll('-', '/');
    
    const response = await axios.get(`${SPORTSDB_BASE}/eventsday.php`, {
      params: { d: dateStr },
      timeout: 10000,
    });

    if (response.data?.events && Array.isArray(response.data.events)) {
      const liveEvents = response.data.events.filter((e: any) => 
        e.strStatus === "Live" || e.strStatus === "HT" || e.strStatus === "1H" || e.strStatus === "2H" ||
        e.strStatus === "Half Time" || e.strStatus === "Second Half"
      );

      const fixtures: SportsFixtureConfig[] = [];
      // Process up to 20 live events
      const eventsToProcess = liveEvents.slice(0, 20);
      
      for (const event of eventsToProcess) {
        try {
          const [homeLogo, awayLogo] = await Promise.all([
            getTeamLogo(event.strHomeTeam || ""),
            getTeamLogo(event.strAwayTeam || ""),
          ]);

          fixtures.push({
            id: `live-${event.idEvent || Math.random()}`,
            leagueId: getLeagueIdFromName(event.strLeague || ""),
            homeTeam: event.strHomeTeam || "TBD",
            awayTeam: event.strAwayTeam || "TBD",
            homeTeamLogo: homeLogo || undefined,
            awayTeamLogo: awayLogo || undefined,
            status: "live",
            kickoffTimeFormatted: "Live Now",
            venue: event.strVenue || "TBD",
            homeScore: event.intHomeScore ? Number.parseInt(String(event.intHomeScore)) : undefined,
            awayScore: event.intAwayScore ? Number.parseInt(String(event.intAwayScore)) : undefined,
            minute: event.strTime || event.strStatus || "Live",
            isLive: true,
          });
        } catch (e) {
          // Skip this event if there's an error
          continue;
        }
      }
      
      if (fixtures.length > 0) {
        return fixtures;
      }
    }
  } catch (error) {
    console.warn("TheSportsDB error:", error);
  }

  // If no live events found, return empty array (will use static data)
  return [];
};

// Get upcoming fixtures
export const getUpcomingFixturesAPI = async (): Promise<SportsFixtureConfig[]> => {
  try {
    // Get today and next 3 days
    const dates: string[] = [];
    for (let i = 0; i <= 3; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push(date.toISOString().split('T')[0].replaceAll('-', '/'));
    }

    const allFixtures: SportsFixtureConfig[] = [];
    
    // Fetch from multiple days
    for (const dateStr of dates) {
      try {
        const response = await axios.get(`${SPORTSDB_BASE}/eventsday.php`, {
          params: { d: dateStr },
          timeout: 10000,
        });

        if (response.data?.events && Array.isArray(response.data.events)) {
          // Filter for upcoming events (not live, not finished)
          const upcomingEvents = response.data.events.filter((e: any) => 
            e.strStatus !== "Live" && 
            e.strStatus !== "HT" && 
            e.strStatus !== "1H" && 
            e.strStatus !== "2H" &&
            e.strStatus !== "FT" &&
            e.strStatus !== "Finished"
          );

          for (const event of upcomingEvents.slice(0, 10)) {
            try {
              const [homeLogo, awayLogo] = await Promise.all([
                getTeamLogo(event.strHomeTeam || ""),
                getTeamLogo(event.strAwayTeam || ""),
              ]);

              const eventDate = new Date((event.dateEvent || dateStr.replaceAll('/', '-')) + " " + (event.strTime || "12:00"));
              const formattedTime = eventDate.toLocaleString('en-US', {
                weekday: 'short',
                hour: '2-digit',
                minute: '2-digit',
              });

              allFixtures.push({
                id: `upcoming-${event.idEvent || Math.random()}`,
                leagueId: getLeagueIdFromName(event.strLeague || ""),
                homeTeam: event.strHomeTeam || "TBD",
                awayTeam: event.strAwayTeam || "TBD",
                homeTeamLogo: homeLogo || undefined,
                awayTeamLogo: awayLogo || undefined,
                status: "upcoming",
                kickoffTimeFormatted: formattedTime,
                venue: event.strVenue || "TBD",
                round: event.strRound || undefined,
              });
            } catch (e) {
              continue;
            }
          }
        }
      } catch (e) {
        continue;
      }
    }
    
    // Remove duplicates
    const unique = allFixtures.filter((fixture, index, self) =>
      index === self.findIndex((f) => f.id === fixture.id)
    );
    
    return unique.slice(0, 30); // Limit to 30
  } catch (error) {
    console.warn("Error fetching upcoming fixtures:", error);
  }

  return [];
};

// Helper to map league names to our league IDs
const getLeagueIdFromName = (leagueName: string): string => {
  const name = leagueName.toLowerCase();
  if (name.includes("premier league") || name.includes("epl")) return "epl";
  if (name.includes("champions league") || name.includes("ucl")) return "ucl";
  if (name.includes("la liga")) return "laliga";
  if (name.includes("ligue 1") || name.includes("ligue1")) return "ligue1";
  if (name.includes("serie a") || name.includes("seriea")) return "seriea";
  if (name.includes("afcon") || name.includes("africa cup")) return "afcon";
  if (name.includes("bundesliga")) return "bundesliga";
  if (name.includes("rugby")) return "rugby-world-cup";
  if (name.includes("ufc")) return "ufc";
  if (name.includes("wwe")) return "wwe";
  return "epl"; // Default
};

// Get live scores for scoreboard
export const getLiveScores = async (): Promise<SportsFixtureConfig[]> => {
  return await getLiveFixturesAPI();
};

// Auto-refresh live scores every 30 seconds
export const subscribeToLiveScores = (
  callback: (fixtures: SportsFixtureConfig[]) => void,
  interval: number = 30000
): (() => void) => {
  let isActive = true;

  const fetchAndUpdate = async () => {
    if (!isActive) return;
    const fixtures = await getLiveScores();
    callback(fixtures);
  };

  fetchAndUpdate(); // Initial fetch
  const intervalId = setInterval(fetchAndUpdate, interval);

  return () => {
    isActive = false;
    clearInterval(intervalId);
  };
};

