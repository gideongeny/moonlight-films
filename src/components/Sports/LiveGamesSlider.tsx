// Live Games Slider Component - MovieBox style
// Horizontal scrollable cards with team logos, VS, and time/status

import { FC, useEffect, useState } from "react";
import { SportsFixtureConfig } from "../../shared/constants";
import { getLiveScores, getUpcomingFixturesAPI } from "../../services/sportsAPI";

interface LiveGamesSliderProps {
  type: "live" | "upcoming";
  title?: string;
}

const LiveGamesSlider: FC<LiveGamesSliderProps> = ({ type, title }) => {
  const [fixtures, setFixtures] = useState<SportsFixtureConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchFixtures = async () => {
      setIsLoading(true);
      try {
        if (type === "live") {
          const live = await getLiveScores();
          setFixtures(live.slice(0, 20));
        } else {
          const upcoming = await getUpcomingFixturesAPI();
          setFixtures(upcoming.slice(0, 20));
        }
      } catch (error) {
        console.error("Error fetching fixtures:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFixtures();
    
    // Refresh every 30 seconds for live games
    if (type === "live") {
      const interval = setInterval(fetchFixtures, 30000);
      return () => clearInterval(interval);
    }
  }, [type]);

  useEffect(() => {
    // Update time every second for countdown
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="mb-8">
        {title && <h3 className="text-xl font-bold text-white mb-4">{title}</h3>}
        <div className="flex items-center justify-center gap-2 text-gray-400 py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span>Loading {type} games...</span>
        </div>
      </div>
    );
  }

  if (fixtures.length === 0) {
    return null;
  }

  const formatTime = (timeStr: string) => {
    if (timeStr === "Live Now" || timeStr.includes("Live")) {
      return "LIVE";
    }
    // Parse and format time - MovieBox style countdown
    try {
      const date = new Date(timeStr);
      const diffMs = date.getTime() - currentTime.getTime();
      
      if (diffMs < 0) return "LIVE";
      
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000);
      
      return `Upcoming - ${String(diffHours).padStart(2, '0')}:${String(diffMins).padStart(2, '0')}:${String(diffSecs).padStart(2, '0')}`;
    } catch {
      // If it's already formatted, return as is
      if (timeStr.includes("Upcoming")) return timeStr;
      return `Upcoming - ${timeStr}`;
    }
  };

  return (
    <div className="mb-8">
      {title && (
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">{title}</h3>
          <a
            href="https://sportslive.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 text-sm font-medium transition"
          >
            More &gt;
          </a>
        </div>
      )}
      
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {fixtures.map((fixture) => (
          <a
            key={fixture.id}
            href="https://sportslive.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-[280px] rounded-lg overflow-hidden hover:shadow-lg hover:shadow-primary/20 transition-all group cursor-pointer"
            style={{
              background: 'linear-gradient(to bottom right, rgba(239, 68, 68, 0.3) 0%, rgba(239, 68, 68, 0.3) 50%, rgba(59, 130, 246, 0.3) 50%, rgba(59, 130, 246, 0.3) 100%)',
              border: '2px solid rgba(239, 68, 68, 0.4)'
            }}
          >
            {/* Status/Time Header - MovieBox style */}
            <div className="px-4 py-2 border-b border-red-500/30"
              style={{
                background: 'linear-gradient(to right, rgba(220, 38, 38, 0.5) 0%, rgba(220, 38, 38, 0.5) 50%, rgba(37, 99, 235, 0.5) 50%, rgba(37, 99, 235, 0.5) 100%)'
              }}
            >
              <div className="flex items-center justify-between">
                <span className="text-white text-xs font-semibold">
                  {fixture.status === "live" ? (
                    <span className="flex items-center gap-2">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                      </span>
                      LIVE
                    </span>
                  ) : (
                    formatTime(fixture.kickoffTimeFormatted)
                  )}
                </span>
                {fixture.minute && fixture.status === "live" && (
                  <span className="text-red-300 text-xs font-bold">{fixture.minute}</span>
                )}
              </div>
            </div>

            {/* Teams Section */}
            <div className="p-4">
              <div className="flex items-center justify-between gap-3">
                {/* Home Team */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  {fixture.homeTeamLogo ? (
                    <img
                      src={fixture.homeTeamLogo}
                      alt={fixture.homeTeam}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center text-sm font-bold text-gray-300">
                      {fixture.homeTeam.charAt(0)}
                    </div>
                  )}
                  <span className="text-white text-sm font-semibold text-center line-clamp-2">
                    {fixture.homeTeam}
                  </span>
                  {fixture.status === "live" && fixture.homeScore !== undefined && (
                    <span className="text-2xl font-bold text-white">
                      {fixture.homeScore}
                    </span>
                  )}
                </div>

                {/* VS or Score */}
                <div className="flex flex-col items-center gap-1">
                  {fixture.status === "live" && fixture.homeScore !== undefined && fixture.awayScore !== undefined ? (
                    <>
                      <span className="text-white text-xl font-bold">-</span>
                    </>
                  ) : (
                    <span className="text-white text-lg font-bold">VS</span>
                  )}
                </div>

                {/* Away Team */}
                <div className="flex flex-col items-center gap-2 flex-1">
                  {fixture.awayTeamLogo ? (
                    <img
                      src={fixture.awayTeamLogo}
                      alt={fixture.awayTeam}
                      className="w-12 h-12 object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gray-700/50 flex items-center justify-center text-sm font-bold text-gray-300">
                      {fixture.awayTeam.charAt(0)}
                    </div>
                  )}
                  <span className="text-white text-sm font-semibold text-center line-clamp-2">
                    {fixture.awayTeam}
                  </span>
                  {fixture.status === "live" && fixture.awayScore !== undefined && (
                    <span className="text-2xl font-bold text-white">
                      {fixture.awayScore}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* League Info Footer */}
            <div className="px-4 py-2 bg-gray-900/30 border-t border-gray-700/50">
              <span className="text-gray-400 text-xs uppercase tracking-wide">
                {fixture.leagueId}
              </span>
            </div>
          </a>
        ))}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default LiveGamesSlider;

