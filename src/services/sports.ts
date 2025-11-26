import axios from "../shared/axios";

export interface LiveFixture {
  id: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  minute?: string;
  status: "live" | "upcoming" | "finished";
  league: string;
  leagueFlag?: string;
  kickoffTime?: string;
  venue?: string;
}

// Using a free sports API - API-Football alternative or similar
// For now, we'll use a combination approach with fallback to static data
export const getLiveFixtures = async (): Promise<LiveFixture[]> => {
  try {
    // Try to fetch from a free sports API
    // Using football-data.org free tier (requires API key but has free tier)
    // Or use API-Sports (requires subscription but has free tier)
    
    // For now, we'll simulate real-time data by fetching from a public endpoint
    // In production, you'd use: https://api.football-data.org/v4/matches (requires API key)
    // Or: https://v3.football.api-sports.io/fixtures?live=all (requires API key)
    
    // Alternative: Use a CORS proxy with a free API
    // Example: https://www.thesportsdb.com/api/v1/json/3/latestsoccer.php (free, no key needed)
    
    const response = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328", // Premier League
      { 
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch live fixtures");
    }

    const data = await response.json();
    
    if (data.events && Array.isArray(data.events)) {
      return data.events.slice(0, 10).map((event: any) => ({
        id: `live-${event.idEvent}`,
        homeTeam: event.strHomeTeam || "Team A",
        awayTeam: event.strAwayTeam || "Team B",
        homeScore: event.intHomeScore ? parseInt(event.intHomeScore) : undefined,
        awayScore: event.intAwayScore ? parseInt(event.intAwayScore) : undefined,
        minute: event.strTime ? event.strTime : undefined,
        status: event.strStatus === "Live" ? "live" : event.strStatus === "Finished" ? "finished" : "upcoming",
        league: event.strLeague || "Premier League",
        kickoffTime: event.strTimestamp || event.dateEvent,
        venue: event.strVenue || "",
      }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching live fixtures:", error);
    // Fallback to static data
    return getStaticFixtures();
  }
};

// Fallback static fixtures
const getStaticFixtures = (): LiveFixture[] => {
  const now = new Date();
  const today = now.toISOString().split('T')[0];
  
  return [
    {
      id: "live-1",
      homeTeam: "Manchester City",
      awayTeam: "Arsenal",
      homeScore: 2,
      awayScore: 1,
      minute: "67'",
      status: "live",
      league: "Premier League",
      kickoffTime: today,
      venue: "Etihad Stadium",
    },
    {
      id: "live-2",
      homeTeam: "Barcelona",
      awayTeam: "Real Madrid",
      homeScore: 1,
      awayScore: 0,
      minute: "45'",
      status: "live",
      league: "La Liga",
      kickoffTime: today,
      venue: "Camp Nou",
    },
    {
      id: "live-3",
      homeTeam: "Liverpool",
      awayTeam: "Chelsea",
      status: "upcoming",
      league: "Premier League",
      kickoffTime: new Date(now.getTime() + 2 * 60 * 60 * 1000).toISOString(),
      venue: "Anfield",
    },
  ];
};

// Get upcoming fixtures
export const getUpcomingFixtures = async (): Promise<LiveFixture[]> => {
  try {
    const response = await fetch(
      "https://www.thesportsdb.com/api/v1/json/3/eventsnextleague.php?id=4328",
      { 
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch upcoming fixtures");
    }

    const data = await response.json();
    
    if (data.events && Array.isArray(data.events)) {
      return data.events
        .filter((event: any) => event.strStatus !== "Live" && event.strStatus !== "Finished")
        .slice(0, 10)
        .map((event: any) => ({
          id: `upcoming-${event.idEvent}`,
          homeTeam: event.strHomeTeam || "Team A",
          awayTeam: event.strAwayTeam || "Team B",
          status: "upcoming" as const,
          league: event.strLeague || "Premier League",
          kickoffTime: event.strTimestamp || event.dateEvent,
          venue: event.strVenue || "",
        }));
    }

    return [];
  } catch (error) {
    console.error("Error fetching upcoming fixtures:", error);
    return [];
  }
};

