// Live Sports Ticker Component - Like moviebox.ph
// Displays scrolling live scores and upcoming games

import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { SportsFixtureConfig } from "../../shared/constants";
import { getLiveScores, subscribeToLiveScores, getUpcomingFixturesAPI } from "../../services/sportsAPI";

const LiveSportsTicker: FC = () => {
  const [liveFixtures, setLiveFixtures] = useState<SportsFixtureConfig[]>([]);
  const [upcomingFixtures, setUpcomingFixtures] = useState<SportsFixtureConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      try {
        const [live, upcoming] = await Promise.all([
          getLiveScores(),
          getUpcomingFixturesAPI(),
        ]);
        setLiveFixtures(live.slice(0, 10));
        setUpcomingFixtures(upcoming.slice(0, 10));
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInitial();

    // Subscribe to live score updates
    const unsubscribe = subscribeToLiveScores((fixtures) => {
      setLiveFixtures(fixtures.slice(0, 10));
    }, 30000); // Update every 30 seconds

    return () => {
      unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="bg-dark-lighten border-b border-gray-800 py-2">
        <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading live scores...</span>
        </div>
      </div>
    );
  }

  const allFixtures = [...liveFixtures, ...upcomingFixtures];

  if (allFixtures.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-900/20 via-dark-lighten to-amber-900/20 border-b border-gray-800 py-2 overflow-hidden">
      <div className="flex items-center gap-6 animate-scroll">
        {/* Live indicator */}
        <div className="flex items-center gap-2 shrink-0 px-4">
          <span className="inline-flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-red-400 font-bold text-xs uppercase tracking-wider">LIVE</span>
          </span>
        </div>

        {/* Scrolling fixtures */}
        <div className="flex items-center gap-8 overflow-hidden">
          {allFixtures.map((fixture, index) => (
            <Link
              key={`${fixture.id}-${index}`}
              to={`/sports/${fixture.leagueId}/${fixture.id}/watch`}
              className="flex items-center gap-4 shrink-0 hover:bg-gray-800/50 px-4 py-1 rounded transition group"
            >
              {/* League/Competition */}
              <span className="text-gray-400 text-xs uppercase tracking-wide whitespace-nowrap">
                {fixture.leagueId.toUpperCase()}
              </span>

              {/* Home Team with Logo */}
              <div className="flex items-center gap-2">
                {fixture.homeTeamLogo ? (
                  <img
                    src={fixture.homeTeamLogo}
                    alt={fixture.homeTeam}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {fixture.homeTeam.charAt(0)}
                  </div>
                )}
                <span className="text-white text-sm font-semibold whitespace-nowrap">
                  {fixture.homeTeam}
                </span>
              </div>

              {/* Score or VS */}
              <div className="flex items-center gap-2">
                {fixture.status === "live" && fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
                  <>
                    <span className="text-white font-bold text-lg">
                      {fixture.homeScore}
                    </span>
                    <span className="text-gray-500">-</span>
                    <span className="text-white font-bold text-lg">
                      {fixture.awayScore}
                    </span>
                    {fixture.minute && (
                      <span className="text-red-400 text-xs font-semibold ml-2">
                        {fixture.minute}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="text-gray-500 text-sm">VS</span>
                )}
              </div>

              {/* Away Team with Logo */}
              <div className="flex items-center gap-2">
                {fixture.awayTeamLogo ? (
                  <img
                    src={fixture.awayTeamLogo}
                    alt={fixture.awayTeam}
                    className="w-6 h-6 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-[10px] font-bold text-gray-400">
                    {fixture.awayTeam.charAt(0)}
                  </div>
                )}
                <span className="text-white text-sm font-semibold whitespace-nowrap">
                  {fixture.awayTeam}
                </span>
              </div>

              {/* Status Badge */}
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold whitespace-nowrap ${
                  fixture.status === "live"
                    ? "bg-red-600/20 text-red-400 border border-red-500/60"
                    : "bg-amber-500/15 text-amber-300 border border-amber-400/60"
                }`}
              >
                {fixture.status === "live" ? "🔴 LIVE" : "UPCOMING"}
              </span>

              {/* Separator */}
              {index < allFixtures.length - 1 && (
                <span className="text-gray-600">•</span>
              )}
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <Link
          to="/sports"
          className="shrink-0 px-4 text-primary text-xs font-semibold hover:text-primary/80 transition whitespace-nowrap"
        >
          View All →
        </Link>
      </div>

      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default LiveSportsTicker;

