import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import Sidebar from "../components/Common/Sidebar";
import ExploreFilter from "../components/Explore/ExploreFilter";
import ExploreResult from "../components/Explore/ExploreResult";
import { useTMDBCollectionQuery } from "../hooks/useCollectionQuery";

const Explore = () => {
  const [searchParams] = useSearchParams();
  const [currentTab, setCurrentTab] = useState<"movie" | "tv">("movie");
  const [isSidebarActive, setIsSidebarActive] = useState(false);
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
      "africa": "🌍 African Cinema & TV",
      "asia": "🌏 Asian Cinema", 
      "latin": "🌎 Latin American Cinema",
      "middleeast": "🕌 Middle Eastern Cinema",
      "nollywood": "🎬 Movies from the Nollywood industry (Nigeria)",
      "bollywood": "🎭 Bollywood (Indian Movies)",
      "korea": "🇰🇷 Korean Drama & Movies",
      "japan": "🇯🇵 Japanese Anime & Movies",
      "china": "🇨🇳 Chinese Cinema",
      "philippines": "🇵🇭 Filipino Movies & TV (ABS-CBN/iWantTFC)",
      "kenya": "🇰🇪 Kenyan Movies & TV (Citizen, NTV, KTN, Showmax)"
    };
    return regionTitles[region] || "Explore Movies & TV Shows";
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Mobile header with clickable logo, consistent with other pages */}
        <div className="flex md:hidden justify-between items-center mb-5">
          <Link to="/" className="flex gap-2 items-center">
            <LazyLoadImage src="/logo.png" className="h-10 w-10 rounded-full object-cover" />
            <p className="text-xl text-white font-medium tracking-wider uppercase">
              Moon<span className="text-primary">light</span>
            </p>
          </Link>
          <button onClick={() => setIsSidebarActive((prev) => !prev)}>
            <GiHamburgerMenu size={25} />
          </button>
        </div>

        {/* Sidebar for navigation on mobile */}
        <div className="md:hidden">
          <Sidebar onCloseSidebar={() => setIsSidebarActive(false)} isSidebarActive={isSidebarActive} />
        </div>

        {/* Desktop header with logo */}
        <div className="hidden md:flex items-center mb-6">
          <Link to="/" className="flex gap-2 items-center">
            <LazyLoadImage src="/logo.png" className="h-10 w-10 rounded-full object-cover" />
            <p className="text-xl text-white font-medium tracking-wider uppercase">
              Moon<span className="text-primary">light</span>
            </p>
          </Link>
        </div>

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
