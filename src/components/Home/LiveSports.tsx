import { FC } from "react";

const LiveSports: FC = () => {
  return (
    <div className="mt-12 space-y-8">
      {/* Live & Upcoming Sports Section - Redirects to sportslive.run */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl text-white font-medium tracking-wider flex items-center gap-2">
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-600 text-white text-xs font-bold">
              LIVE
            </span>
            Live Sports
          </h2>
          <a
            href="https://sportslive.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline"
          >
            Watch All Live Games →
          </a>
        </div>
        <div className="rounded-lg bg-dark-lighten border border-gray-800 p-6 text-center">
          <p className="text-white text-lg mb-3">
            Watch live football, basketball, and all sports matches
          </p>
          <a
            href="https://sportslive.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/80 transition font-medium"
          >
            <span>Go to Live Sports</span>
            <span>→</span>
          </a>
        </div>
      </div>

      {/* Upcoming Matches Section */}
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
        <div className="rounded-lg bg-dark-lighten border border-gray-800 p-6 text-center">
          <p className="text-white text-lg mb-3">
            Check upcoming matches and fixtures
          </p>
          <a
            href="https://sportslive.run/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 text-black rounded-lg hover:bg-amber-400 transition font-medium"
          >
            <span>View Upcoming Games</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </div>
  );
};

export default LiveSports;

