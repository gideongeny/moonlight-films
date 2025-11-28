import { FC } from "react";
import LiveGamesSlider from "../Sports/LiveGamesSlider";

const LiveSports: FC = () => {
  return (
    <div className="mt-12 space-y-8">
      {/* Live Matches Section - MovieBox Style */}
      <LiveGamesSlider type="live" title="Live" />
      
      {/* Upcoming Matches Section - MovieBox Style */}
      <LiveGamesSlider type="upcoming" title="Upcoming" />
    </div>
  );
};

export default LiveSports;

