import { FC, useEffect, useState } from "react";
import { MdSportsSoccer } from "react-icons/md";
import { getLiveFixtures, getUpcomingFixtures, LiveFixture } from "../../services/sports";

const LiveSports: FC = () => {
  const [liveMatches, setLiveMatches] = useState<LiveFixture[]>([]);
  const [upcomingMatches, setUpcomingMatches] = useState<LiveFixture[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFixtures = async () => {
      setIsLoading(true);
      try {
        const [live, upcoming] = await Promise.all([
          getLiveFixtures(),
          getUpcomingFixtures(),
        ]);
        setLiveMatches(live.filter(f => f.status === "live").slice(0, 6));
        setUpcomingMatches(upcoming.slice(0, 6));
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixtures();
    // Refresh every 2 minutes
    const interval = setInterval(fetchFixtures, 120000);
    return () => clearInterval(interval);
  }, []);

  const handleMatchClick = () => {
    window.open("https://sportslive.run/", "_blank");
  };

  return (
    <div className="mt-12 space-y-8">
      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white font-medium tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                </span>
              </span>
              Live Now
            </h2>
            <a
              href="https://sportslive.run/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              View All →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((fixture) => {
              return (
                <button
                  key={fixture.id}
                  onClick={handleMatchClick}
                  className="group cursor-pointer rounded-lg bg-dark-lighten border border-gray-800 hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition p-4 text-left w-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {league?.flag && <span className="text-sm">{league.flag}</span>}
                      <span className="text-xs text-gray-400 uppercase">
                        {league?.shortName || league?.name}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-600/20 text-red-400 text-[10px] font-semibold border border-red-500/60">
                      LIVE
                    </span>
                  </div>
                  
                  {/* Score Display */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm mb-1">
                        {fixture.homeTeam}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {fixture.awayTeam}
                      </p>
                    </div>
                    <div className="text-center">
                      {fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
                        <>
                          <div className="text-2xl font-bold text-white mb-1">
                            {fixture.homeScore} - {fixture.awayScore}
                          </div>
                          {fixture.minute && (
                            <span className="text-xs text-red-400 font-semibold">
                              {fixture.minute}
                            </span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-gray-400">VS</span>
                      )}
                    </div>
                  </div>
                  
                  {fixture.kickoffTime && (
                    <p className="text-xs text-gray-400">
                      {new Date(fixture.kickoffTime).toLocaleString()}
                    </p>
                  )}
                  {fixture.venue && (
                    <p className="text-xs text-gray-500 mt-1">{fixture.venue}</p>
                  )}
                  
                  <div className="mt-3 flex items-center gap-2 text-primary text-xs group-hover:text-primary/80 transition">
                    <MdSportsSoccer size={14} />
                    <span>Watch on SportsLive</span>
                    <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Upcoming Matches Section */}
      {upcomingMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white font-medium tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-black text-xs font-bold">
                UP
              </span>
              Upcoming Games
            </h2>
            <a
              href="https://sportslive.run/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-sm hover:underline"
            >
              View Schedule →
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map((fixture) => {
              return (
                <button
                  key={fixture.id}
                  onClick={handleMatchClick}
                  className="group cursor-pointer rounded-lg bg-dark-lighten border border-gray-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition p-4 text-left w-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400 uppercase">
                        {fixture.league}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-400/60">
                      UPCOMING
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <p className="text-white font-semibold text-sm mb-1">
                        {fixture.homeTeam}
                      </p>
                      <p className="text-white font-semibold text-sm">
                        {fixture.awayTeam}
                      </p>
                    </div>
                    <span className="text-xs text-gray-400">VS</span>
                  </div>
                  
                  {fixture.kickoffTime && (
                    <p className="text-xs text-gray-400">
                      {new Date(fixture.kickoffTime).toLocaleString()}
                    </p>
                  )}
                  {fixture.venue && (
                    <p className="text-xs text-gray-500 mt-1">{fixture.venue}</p>
                  )}
                  
                  <div className="mt-3 flex items-center gap-2 text-amber-400 text-xs group-hover:text-amber-300 transition">
                    <MdSportsSoccer size={14} />
                    <span>Watch on SportsLive</span>
                    <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="inline-block h-8 w-8 rounded-full border-[3px] border-primary border-t-transparent animate-spin"></div>
          <p className="text-gray-400 mt-4">Loading live fixtures...</p>
        </div>
      )}

      {!isLoading && liveMatches.length === 0 && upcomingMatches.length === 0 && (
        <div className="rounded-lg bg-dark-lighten border border-gray-800 p-6 text-center">
          <p className="text-white text-lg mb-3">
            No live or upcoming matches at the moment
          </p>
          <a
            href="https://sportslive.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition font-medium"
          >
            <span>Check SportsLive for all matches</span>
            <span>→</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default LiveSports;

