import { motion, AnimatePresence } from "framer-motion";
import { FunctionComponent } from "react";
import { Item } from "../../shared/types";
import ExploreResultContent from "./ExploreResultContent";

interface ExploreResultProps {
  currentTab: "movie" | "tv";
  data: Item[];
  isLoading: boolean;
  error: string | null;
}

const ExploreResult: FunctionComponent<ExploreResultProps> = ({
  currentTab,
  data,
  isLoading,
  error,
}) => {
  if (error) return <div className="text-red-500">ERROR: {error}</div>;
  if (isLoading) return <div className="text-white">Loading...</div>;

  return (
    <div>
      <ExploreResultContent
        data={[{ results: data, page: 1, total_pages: 1, total_results: data.length }]}
        fetchNext={() => {}}
        hasMore={false}
      />
    </div>
  );
};

export default ExploreResult;
