import { FC } from "react";
import { Link } from "react-router-dom";
import { MdSportsSoccer } from "react-icons/md";
import { SPORTS_FIXTURES, SPORTS_LEAGUES } from "../../shared/constants";

const LiveSports: FC = () => {
  const liveMatches = SPORTS_FIXTURES.filter((f) => f.status === "live").slice(0, 6);
  const upcomingMatches = SPORTS_FIXTURES.filter((f) => f.status === "upcoming").slice(0, 6);

  if (liveMatches.length === 0 && upcomingMatches.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 space-y-8">
      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl text-white font-medium tracking-wider flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
                LIVE
              </span>
              Live Now
            </h2>
            <Link
              to="/sports?status=live"
              className="text-primary text-sm hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {liveMatches.map((fixture) => {
              const league = SPORTS_LEAGUES.find((l) => l.id === fixture.leagueId);
              return (
                <Link
                  key={fixture.id}
                  to={`/sports/${fixture.leagueId}/${fixture.id}/watch`}
                  className="group rounded-lg bg-dark-lighten border border-gray-800 hover:border-primary/70 hover:shadow-lg hover:shadow-primary/20 transition p-4"
                >
                  <div className="flex items-start justify-between mb-2">
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
                  <p className="text-white font-semibold text-sm mb-1">
                    {fixture.homeTeam} <span className="text-gray-400">vs</span>{" "}
                    {fixture.awayTeam}
                  </p>
                  <p className="text-xs text-gray-400">{fixture.kickoffTimeFormatted}</p>
                </Link>
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
              Upcoming
            </h2>
            <Link
              to="/sports?status=upcoming"
              className="text-primary text-sm hover:underline"
            >
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingMatches.map((fixture) => {
              const league = SPORTS_LEAGUES.find((l) => l.id === fixture.leagueId);
              return (
                <Link
                  key={fixture.id}
                  to={`/sports/${fixture.leagueId}/${fixture.id}/watch`}
                  className="group rounded-lg bg-dark-lighten border border-gray-800 hover:border-amber-500/50 hover:shadow-lg hover:shadow-amber-500/20 transition p-4"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {league?.flag && <span className="text-sm">{league.flag}</span>}
                      <span className="text-xs text-gray-400 uppercase">
                        {league?.shortName || league?.name}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-semibold border border-amber-400/60">
                      UPCOMING
                    </span>
                  </div>
                  <p className="text-white font-semibold text-sm mb-1">
                    {fixture.homeTeam} <span className="text-gray-400">vs</span>{" "}
                    {fixture.awayTeam}
                  </p>
                  <p className="text-xs text-gray-400">{fixture.kickoffTimeFormatted}</p>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveSports;

