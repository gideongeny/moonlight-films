import { FC, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdSportsSoccer } from "react-icons/md";

import Sidebar from "../../components/Common/Sidebar";
import SidebarMini from "../../components/Common/SidebarMini";
import SearchBox from "../../components/Common/SearchBox";
import Title from "../../components/Common/Title";
import Footer from "../../components/Footer/Footer";
import { useCurrentViewportView } from "../../hooks/useCurrentViewportView";
import { SPORTS_FIXTURES, SPORTS_LEAGUES } from "../../shared/constants";

const SportsHome: FC = () => {
  const { isMobile } = useCurrentViewportView();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [activeLeague, setActiveLeague] = useState<string>("all");
  const [activeStatus, setActiveStatus] = useState<"live" | "upcoming" | "replay">("live");

  const filteredFixtures = useMemo(
    () =>
      SPORTS_FIXTURES.filter((fixture) => {
        const matchLeague =
          activeLeague === "all" || fixture.leagueId === activeLeague;
        const matchStatus = fixture.status === activeStatus;
        return matchLeague && matchStatus;
      }),
    [activeLeague, activeStatus]
  );

  const liveCount = SPORTS_FIXTURES.filter(
    (fixture) => fixture.status === "live"
  ).length;
  const upcomingCount = SPORTS_FIXTURES.filter(
    (fixture) => fixture.status === "upcoming"
  ).length;
  const replayCount = SPORTS_FIXTURES.filter(
    (fixture) => fixture.status === "replay"
  ).length;

  return (
    <>
      <Title value="StreamLux | Live Sports Streaming" />

      <div className="flex md:hidden justify-between items-center px-5 my-5">
        <Link to="/" className="flex gap-2 items-center">
          <LazyLoadImage
            src="/logo.png"
            className="h-10 w-10 rounded-full object-cover"
          />
          <p className="text-xl text-white font-medium tracking-wider uppercase">
            Stream<span className="text-primary">Lux</span>
          </p>
        </Link>
        <button onClick={() => setIsSidebarActive((prev) => !prev)}>
          <GiHamburgerMenu size={25} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {!isMobile && <SidebarMini />}
        {isMobile && (
          <Sidebar
            onCloseSidebar={() => setIsSidebarActive(false)}
            isSidebarActive={isSidebarActive}
          />
        )}

        <div className="flex-grow px-[2vw] md:pt-11 pt-0 pb-10">
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3 mb-2">
              <span className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary/20 text-primary">
                <MdSportsSoccer size={20} />
              </span>
              Live Sports & Tournaments
            </h1>
            <p className="text-gray-400 text-sm md:text-base max-w-2xl">
              Stream EPL, UEFA Champions League, La Liga, Ligue&nbsp;1,
              Serie&nbsp;A, AFCON, Rugby, UFC, WWE and more. Times are shown in your
              local timezone. Streams are provided by secure third‑party
              partners you configure.
            </p>
          </div>
          
          {!isMobile && (
            <div className="mb-6 max-w-md">
              <SearchBox relative={true} />
            </div>
          )}

          <div className="flex flex-wrap gap-3 mb-6">
            <button
              onClick={() => setActiveStatus("live")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeStatus === "live"
                  ? "bg-red-600 text-white border-red-500"
                  : "border-red-600/40 text-red-400 hover:border-red-400"
              }`}
            >
              Live Now
            </button>
            <button
              onClick={() => setActiveStatus("upcoming")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeStatus === "upcoming"
                  ? "bg-amber-500 text-black border-amber-400"
                  : "border-amber-400/40 text-amber-300 hover:border-amber-300"
              }`}
            >
              Upcoming
            </button>
            <button
              onClick={() => setActiveStatus("replay")}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                activeStatus === "replay"
                  ? "bg-emerald-500 text-black border-emerald-500"
                  : "border-emerald-500/40 text-emerald-300 hover:border-emerald-300"
              }`}
            >
              Replays
            </button>
          </div>

          {/* MovieBox-style match tracker summary */}
          <div className="grid grid-cols-3 gap-3 mb-6 text-xs md:text-sm">
            <div className="rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3">
              <p className="text-red-300 font-semibold mb-1">Live</p>
              <p className="text-white text-2xl md:text-3xl font-bold">
                {liveCount}
              </p>
              <p className="text-red-400/70 text-[10px] mt-1">matches now</p>
            </div>
            <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3">
              <p className="text-amber-200 font-semibold mb-1">Upcoming</p>
              <p className="text-white text-2xl md:text-3xl font-bold">
                {upcomingCount}
              </p>
              <p className="text-amber-300/70 text-[10px] mt-1">scheduled</p>
            </div>
            <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/10 px-4 py-3">
              <p className="text-emerald-200 font-semibold mb-1">Replays</p>
              <p className="text-white text-2xl md:text-3xl font-bold">
                {replayCount}
              </p>
              <p className="text-emerald-300/70 text-[10px] mt-1">available</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            <button
              onClick={() => setActiveLeague("all")}
              className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition ${
                activeLeague === "all"
                  ? "bg-white text-black border-white"
                  : "border-gray-600 text-gray-300 hover:border-gray-300"
              }`}
            >
              All Competitions
            </button>
            {SPORTS_LEAGUES.map((league) => (
              <button
                key={league.id}
                onClick={() => setActiveLeague(league.id)}
                className={`px-3 py-1.5 rounded-full text-xs md:text-sm border transition flex items-center gap-2 ${
                  activeLeague === league.id
                    ? "bg-primary text-white border-primary"
                    : "border-gray-700 text-gray-300 hover:border-gray-300"
                }`}
              >
                {league.flag && <span>{league.flag}</span>}
                <span>{league.shortName}</span>
              </button>
            ))}
          </div>

          {filteredFixtures.length === 0 && (
            <div className="py-12 text-center text-gray-400 border border-dashed border-gray-700 rounded-xl">
              <p className="text-lg font-medium mb-2">No matches in this filter</p>
              <p className="text-sm">
                Try switching to another status (Live / Upcoming / Replay) or select a
                different competition.
              </p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredFixtures.map((fixture) => {
              const league = SPORTS_LEAGUES.find(
                (item) => item.id === fixture.leagueId
              );

              return (
                <Link
                  key={fixture.id}
                  to={`/sports/${fixture.leagueId}/${fixture.id}/watch`}
                  className="group rounded-xl bg-dark-lighten border border-gray-800 hover:border-primary/70 hover:shadow-xl hover:shadow-primary/20 transition overflow-hidden"
                >
                  <div className="p-4 flex items-start gap-3">
                    <div className="mt-1">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary">
                        <MdSportsSoccer size={18} />
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-3 mb-1">
                        <p className="text-xs uppercase tracking-wide text-gray-400 flex items-center gap-2">
                          <span className="inline-flex items-center gap-1">
                            {league?.flag && (
                              <span className="text-base">{league.flag}</span>
                            )}
                            <span>{league?.name}</span>
                          </span>
                          {fixture.round && (
                            <>
                              <span>•</span>
                              <span>{fixture.round}</span>
                            </>
                          )}
                        </p>
                        <span
                          className={`text-[10px] px-2 py-1 rounded-full font-semibold tracking-wide ${
                            fixture.status === "live"
                              ? "bg-red-600/20 text-red-400 border border-red-500/60"
                              : fixture.status === "upcoming"
                              ? "bg-amber-500/15 text-amber-300 border border-amber-400/60"
                              : "bg-emerald-500/15 text-emerald-300 border border-emerald-500/60"
                          }`}
                        >
                          {fixture.status === "live"
                            ? "LIVE"
                            : fixture.status === "upcoming"
                            ? "UPCOMING"
                            : "REPLAY"}
                        </span>
                      </div>

                      <p className="text-white font-semibold text-base md:text-lg mb-1">
                        {fixture.homeTeam} <span className="text-gray-400">vs</span>{" "}
                        {fixture.awayTeam}
                      </p>

                      <p className="text-xs text-gray-400 mb-2">
                        {fixture.kickoffTimeFormatted} • {fixture.venue}
                      </p>

                      {fixture.broadcast && (
                        <p className="text-[10px] text-gray-400">
                          Broadcast:{" "}
                          <span className="text-gray-200">
                            {fixture.broadcast.join(" · ")}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="px-4 pb-4 flex items-center justify-between text-xs text-gray-400 border-t border-gray-800">
                    <span className="py-2">
                      Click to{" "}
                      <span className="text-primary font-medium">
                        open secure stream
                      </span>
                    </span>
                    <span className="py-2 text-primary opacity-0 group-hover:opacity-100 transition">
                      Watch now →
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default SportsHome;


