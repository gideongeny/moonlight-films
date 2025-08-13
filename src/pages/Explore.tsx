import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ExploreFilter from "../components/Explore/ExploreFilter";
import ExploreResult from "../components/Explore/ExploreResult";
import { useTMDBCollectionQuery } from "../hooks/useCollectionQuery";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState<"movie" | "tv">("movie");
  const [filters, setFilters] = useState({
    sortBy: "popularity.desc",
    genres: [] as number[],
    year: "",
    runtime: "",
    region: searchParams.get("region") || "" // Add region filter
  });

  const { data, isLoading, error } = useTMDBCollectionQuery(
    currentTab,
    filters.sortBy,
    filters.genres,
    filters.year,
    filters.runtime,
    filters.region // Pass region to the query
  );

  useEffect(() => {
    // Update filters when URL params change
    const region = searchParams.get("region");
    if (region) {
      setFilters(prev => ({ ...prev, region }));
    }
  }, [searchParams]);

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getRegionTitle = (region: string) => {
    const regionTitles: Record<string, string> = {
      "africa": "🌍 African Cinema",
      "asia": "🌏 Asian Cinema", 
      "latin": "🌎 Latin American Cinema",
      "middleeast": "🕌 Middle Eastern Cinema",
      "nollywood": "🎬 Nollywood (Nigerian Movies)",
      "bollywood": "🎭 Bollywood (Indian Movies)",
      "korea": "🇰🇷 Korean Drama & Movies",
      "japan": "🇯🇵 Japanese Anime & Movies",
      "china": "🇨🇳 Chinese Cinema"
    };
    return regionTitles[region] || "Explore Movies & TV Shows";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            {filters.region ? getRegionTitle(filters.region) : "Explore Movies & TV Shows"}
          </h1>
          {filters.region && (
            <p className="text-gray-400">
              Discover amazing content from around the world
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <ExploreFilter
              currentTab={currentTab}
              onTabChange={setCurrentTab}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="lg:col-span-3">
            <ExploreResult
              data={data}
              isLoading={isLoading}
              error={error}
              currentTab={currentTab}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Explore;
