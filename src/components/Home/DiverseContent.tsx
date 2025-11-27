import React, { useEffect, useState } from 'react';
import { Item } from '../../shared/types';
import { 
  getAfricanContent, 
  getAsianContent, 
  getLatinAmericanContent, 
  getMiddleEasternContent,
  getNollywoodContent,
  getBollywoodContent,
  getKoreanContent,
  getJapaneseContent,
  getChineseContent,
  getEastAfricanContent,
  getSouthAfricanContent,
  getSoutheastAsianContent,
  getFilipinoContent,
  getBrazilianContent,
  getMexicanContent,
  getKenyanTVShows,
  getNigerianTVShows,
  getAfricanTVContent,
  getEnhancedNollywoodContent,
  getEnhancedKenyanContent,
  getTrendingNow,
  getHorrorMovies,
  getActionMovies,
  getComedyMovies,
  getDramaMovies,
  getThrillerMovies,
  getRomanceMovies,
  getSciFiMovies,
  getAnimationMovies,
  getDocumentaryMovies,
  getCrimeMovies,
  getAdventureMovies,
  getFantasyMovies
} from '../../services/home';
import SectionSlider from '../Slider/SectionSlider';
import Skeleton from '../Common/Skeleton';

interface DiverseContentProps {
  currentTab: "movie" | "tv" | "sports";
}

const DiverseContent: React.FC<DiverseContentProps> = ({ currentTab }) => {
  const [africanContent, setAfricanContent] = useState<Item[]>([]);
  const [asianContent, setAsianContent] = useState<Item[]>([]);
  const [latinAmericanContent, setLatinAmericanContent] = useState<Item[]>([]);
  const [middleEasternContent, setMiddleEasternContent] = useState<Item[]>([]);
  const [nollywoodContent, setNollywoodContent] = useState<Item[]>([]);
  const [bollywoodContent, setBollywoodContent] = useState<Item[]>([]);
  const [koreanContent, setKoreanContent] = useState<Item[]>([]);
  const [japaneseContent, setJapaneseContent] = useState<Item[]>([]);
  const [chineseContent, setChineseContent] = useState<Item[]>([]);
  const [eastAfricanContent, setEastAfricanContent] = useState<Item[]>([]);
  const [southAfricanContent, setSouthAfricanContent] = useState<Item[]>([]);
  const [southeastAsianContent, setSoutheastAsianContent] = useState<Item[]>([]);
  const [filipinoContent, setFilipinoContent] = useState<Item[]>([]);
  const [brazilianContent, setBrazilianContent] = useState<Item[]>([]);
  const [mexicanContent, setMexicanContent] = useState<Item[]>([]);
  const [kenyanTVShows, setKenyanTVShows] = useState<Item[]>([]);
  const [nigerianTVShows, setNigerianTVShows] = useState<Item[]>([]);
  const [africanTVContent, setAfricanTVContent] = useState<Item[]>([]);
  const [enhancedNollywood, setEnhancedNollywood] = useState<Item[]>([]);
  const [enhancedKenyan, setEnhancedKenyan] = useState<Item[]>([]);
  const [trendingAll, setTrendingAll] = useState<Item[]>([]);
  const [horrorMovies, setHorrorMovies] = useState<Item[]>([]);
  const [actionMovies, setActionMovies] = useState<Item[]>([]);
  const [comedyMovies, setComedyMovies] = useState<Item[]>([]);
  const [dramaMovies, setDramaMovies] = useState<Item[]>([]);
  const [thrillerMovies, setThrillerMovies] = useState<Item[]>([]);
  const [romanceMovies, setRomanceMovies] = useState<Item[]>([]);
  const [sciFiMovies, setSciFiMovies] = useState<Item[]>([]);
  const [animationMovies, setAnimationMovies] = useState<Item[]>([]);
  const [documentaryMovies, setDocumentaryMovies] = useState<Item[]>([]);
  const [crimeMovies, setCrimeMovies] = useState<Item[]>([]);
  const [adventureMovies, setAdventureMovies] = useState<Item[]>([]);
  const [fantasyMovies, setFantasyMovies] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDiverseContent = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all diverse content in parallel
        const [
          african,
          asian,
          latinAmerican,
          middleEastern,
          nollywood,
          bollywood,
          korean,
          japanese,
          chinese,
          eastAfrican,
          southAfrican,
          southeastAsian,
          filipino,
          brazilian,
          mexican,
          kenyanTV,
          nigerianTV,
          africanTV,
          enhancedNolly,
          enhancedKenya,
          trending,
          horror,
          action,
          comedy,
          drama,
          thriller,
          romance,
          sciFi,
          animation,
          documentary,
          crime,
          adventure,
          fantasy
        ] = await Promise.all([
          getAfricanContent(),
          getAsianContent(),
          getLatinAmericanContent(),
          getMiddleEasternContent(),
          getNollywoodContent(),
          getBollywoodContent(),
          getKoreanContent(),
          getJapaneseContent(),
          getChineseContent(),
          getEastAfricanContent(),
          getSouthAfricanContent(),
          getSoutheastAsianContent(),
          getFilipinoContent(),
          getBrazilianContent(),
          getMexicanContent(),
          getKenyanTVShows(),
          getNigerianTVShows(),
          getAfricanTVContent(),
          getEnhancedNollywoodContent(),
          getEnhancedKenyanContent(),
          getTrendingNow(),
          getHorrorMovies(),
          getActionMovies(),
          getComedyMovies(),
          getDramaMovies(),
          getThrillerMovies(),
          getRomanceMovies(),
          getSciFiMovies(),
          getAnimationMovies(),
          getDocumentaryMovies(),
          getCrimeMovies(),
          getAdventureMovies(),
          getFantasyMovies()
        ]);

        setAfricanContent(african);
        setAsianContent(asian);
        setLatinAmericanContent(latinAmerican);
        setMiddleEasternContent(middleEastern);
        setNollywoodContent(nollywood);
        setBollywoodContent(bollywood);
        setKoreanContent(korean);
        setJapaneseContent(japanese);
        setChineseContent(chinese);
        setEastAfricanContent(eastAfrican);
        setSouthAfricanContent(southAfrican);
        setSoutheastAsianContent(southeastAsian);
        setFilipinoContent(filipino);
        setBrazilianContent(brazilian);
        setMexicanContent(mexican);
        setKenyanTVShows(kenyanTV);
        setNigerianTVShows(nigerianTV);
        setAfricanTVContent(africanTV);
        setEnhancedNollywood(enhancedNolly);
        setEnhancedKenyan(enhancedKenya);
        setTrendingAll(trending);
        setHorrorMovies(horror);
        setActionMovies(action);
        setComedyMovies(comedy);
        setDramaMovies(drama);
        setThrillerMovies(thriller);
        setRomanceMovies(romance);
        setSciFiMovies(sciFi);
        setAnimationMovies(animation);
        setDocumentaryMovies(documentary);
        setCrimeMovies(crime);
        setAdventureMovies(adventure);
        setFantasyMovies(fantasy);
        
      } catch (error) {
        console.error('Error fetching diverse content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiverseContent();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-8 mt-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            🌍 World Cinema
          </h2>
          <p className="text-gray-400 text-lg">
            Loading diverse content from around the world...
          </p>
        </div>
        {[...Array(10)].map((_, index) => (
          <div key={index}>
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {[...Array(6)].map((_, itemIndex) => (
                <Skeleton key={itemIndex} className="h-0 pb-[150%] rounded" />
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  const totalContent = africanContent.length + asianContent.length + 
    latinAmericanContent.length + middleEasternContent.length + 
    nollywoodContent.length + bollywoodContent.length + 
    koreanContent.length + japaneseContent.length + chineseContent.length +
    eastAfricanContent.length + southAfricanContent.length +
    southeastAsianContent.length + filipinoContent.length +
    brazilianContent.length + mexicanContent.length +
    kenyanTVShows.length + nigerianTVShows.length +
    africanTVContent.length + enhancedNollywood.length + enhancedKenyan.length +
    trendingAll.length + horrorMovies.length;

  if (totalContent === 0) {
    return (
      <div className="text-center py-12 mt-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🌍 World Cinema
        </h2>
        <h3 className="text-xl text-gray-400 mb-4">No Diverse Content Available</h3>
        <p className="text-gray-500">
          We're working on adding more African, Asian, and international content to our library.
          <br />
          Check back soon for updates!
        </p>
      </div>
    );
  }

  // Derived curated categories similar to MovieBox-style sections
  const latestNollywoodMovies = enhancedNollywood
    .filter((item) => item.media_type === "movie")
    .sort((a, b) => {
      const ad = (a as any).release_date || (a as any).first_air_date || "";
      const bd = (b as any).release_date || (b as any).first_air_date || "";
      return bd.localeCompare(ad);
    });

  const southAfricanDrama = southAfricanContent.filter((item) => {
    const origin = ((item as any).origin_country || []) as string[];
    const genres = ((item as any).genre_ids || []) as number[];
    return origin.includes("ZA") && genres.includes(18);
  });

  const thaiDrama = southeastAsianContent.filter((item) => {
    const origin = ((item as any).origin_country || []) as string[];
    const genres = ((item as any).genre_ids || []) as number[];
    return origin.includes("TH") && genres.includes(18);
  });

  // Combine multiple sources for Must-watch Black Shows
  const mustWatchBlackShows = [
    ...africanTVContent.filter((item) => item.media_type === "tv"),
    ...nigerianTVShows.filter((item) => item.media_type === "tv"),
    ...kenyanTVShows.filter((item) => item.media_type === "tv"),
    ...enhancedKenyan.filter((item) => item.media_type === "tv"),
  ]
    .filter((item, index, self) => 
      index === self.findIndex((t) => t.id === item.id)
    )
    .slice(0, 20);

  // Combine multiple sources for Must-watch Black Movies
  const mustWatchBlackMovies = [
    ...africanContent.filter((item) => item.media_type === "movie"),
    ...enhancedNollywood.filter((item) => item.media_type === "movie"),
    ...eastAfricanContent.filter((item) => item.media_type === "movie"),
    ...southAfricanContent.filter((item) => item.media_type === "movie"),
  ]
    .filter((item, index, self) => 
      index === self.findIndex((t) => t.id === item.id)
    )
    .slice(0, 20);

  // Enhanced African Cinema & TV Shows - combine all African sources
  const enhancedAfricanCinema = [
    ...africanContent,
    ...enhancedNollywood,
    ...enhancedKenyan,
    ...eastAfricanContent,
    ...southAfricanContent,
    ...africanTVContent,
    ...nigerianTVShows,
    ...kenyanTVShows,
  ]
    .filter((item, index, self) => 
      index === self.findIndex((t) => t.id === item.id)
    )
    .slice(0, 20);
  return (
    <div className="space-y-8 mt-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🌍 World Cinema
        </h2>
        <p className="text-gray-400 text-lg">
          Discover amazing movies and TV shows from around the world
        </p>
      </div>

      {/* Most Trending (all media types) - Filter by currentTab */}
      {trendingAll.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🔥 Most Trending ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
          films={trendingAll.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={10}
          isLoading={false}
        />
      )}

      {/* Horror - Filtered by genre ID 27 and media type */}
      {(() => {
        const filtered = horrorMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(27);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`👻 Horror ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {/* Must-watch Black Shows (derived from African TV content) - Only show on TV tab */}
      {currentTab === "tv" && mustWatchBlackShows.length > 0 && (
        <SectionSlider
          title="✊🏿 Must-watch Black Shows"
          films={mustWatchBlackShows}
          limitNumber={10}
          isLoading={false}
        />
      )}

      {/* Must-watch Black Movies (African cinema) - Only show on Movie tab */}
      {currentTab === "movie" && mustWatchBlackMovies.length > 0 && (
        <SectionSlider
          title="✊🏿 Must-watch Black Movies"
          films={mustWatchBlackMovies}
          limitNumber={10}
          isLoading={false}
        />
      )}
      {/* Enhanced African Content - Filter by media type */}
      {enhancedAfricanCinema.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🌍 African ${currentTab === "movie" ? "Cinema" : "TV Shows"}`}
          films={enhancedAfricanCinema.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={10}
          isLoading={false}
        />
      )}

      {/* African TV Shows & Series - Enhanced with more sources - Only show on TV tab */}
      {currentTab === "tv" && (() => {
        // Combine all African TV sources for maximum diversity
        const allAfricanTV = [
          ...africanTVContent.filter((item) => item.media_type === "tv"),
          ...nigerianTVShows.filter((item) => item.media_type === "tv"),
          ...kenyanTVShows.filter((item) => item.media_type === "tv"),
          ...enhancedKenyan.filter((item) => item.media_type === "tv"),
          ...eastAfricanContent.filter((item) => item.media_type === "tv"),
          ...southAfricanContent.filter((item) => item.media_type === "tv"),
        ]
          .filter((item, index, self) => 
            index === self.findIndex((t) => t.id === item.id)
          )
          .slice(0, 20);
        
        return allAfricanTV.length > 0 ? (
          <SectionSlider
            title="📺 African TV Shows & Series"
            films={allAfricanTV}
            limitNumber={15}
            isLoading={false}
          />
        ) : null;
      })()}

      {/* Enhanced Nollywood Content - Filter by media type */}
      {enhancedNollywood.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🎬 Enhanced: ${currentTab === "movie" ? "Movies" : "TV Shows"} from the Nollywood industry (Nigeria)`}
          films={enhancedNollywood.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Enhanced Kenyan Content - Filter by media type */}
      {enhancedKenyan.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇰🇪 Enhanced Kenyan ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
          films={enhancedKenyan.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* African TV Content - Only show on TV tab */}
      {currentTab === "tv" && africanTVContent.length > 0 && (
        <SectionSlider
          title="📺 African TV Shows & Series"
          films={africanTVContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* East African Content - Filter by media type */}
      {eastAfricanContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🌍 East African ${currentTab === "movie" ? "Cinema" : "TV Shows"} (Kenya, Tanzania, Uganda, Ethiopia)`}
          films={eastAfricanContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Kenyan TV Shows - Only show on TV tab */}
      {currentTab === "tv" && kenyanTVShows.length > 0 && (
        <SectionSlider
          title="🇰🇪 Kenyan TV Shows (Citizen TV, NTV Kenya, KTN Kenya)"
          films={kenyanTVShows}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* South African Content - Filter by media type */}
      {southAfricanContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇿🇦 South African ${currentTab === "movie" ? "Cinema" : "TV Shows"}`}
          films={southAfricanContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* South African Drama - Filter by media type */}
      {southAfricanDrama.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇿🇦 SA Drama ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
          films={southAfricanDrama.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={10}
          isLoading={false}
        />
      )}
      {/* Nollywood Content - Filter by media type */}
      {nollywoodContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🎬 ${currentTab === "movie" ? "Movies" : "TV Shows"} from the Nollywood industry (Nigeria)`}
          films={nollywoodContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Latest Nollywood Movies - Only show on Movie tab */}
      {currentTab === "movie" && latestNollywoodMovies.length > 0 && (
        <SectionSlider
          title="🆕 Latest Nollywood Movies"
          films={latestNollywoodMovies}
          limitNumber={10}
          isLoading={false}
        />
      )}
      {/* Nigerian TV Shows - Only show on TV tab */}
      {currentTab === "tv" && nigerianTVShows.length > 0 && (
        <SectionSlider
          title="🇳🇬 Nigerian TV Shows & Series"
          films={nigerianTVShows}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Asian Content - Filter by media type */}
      {asianContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🌏 Asian ${currentTab === "movie" ? "Cinema" : "TV Shows"}`}
          films={asianContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Southeast Asian Content - Filter by media type */}
      {southeastAsianContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🌏 Southeast Asian ${currentTab === "movie" ? "Cinema" : "TV Shows"} (Thailand, Vietnam, Malaysia, Singapore, Indonesia)`}
          films={southeastAsianContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Thai Drama - Filter by media type */}
      {thaiDrama.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇹🇭 Thai Drama ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
          films={thaiDrama.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={10}
          isLoading={false}
        />
      )}
      {/* Filipino Content - Filter by media type */}
      {filipinoContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇵🇭 Filipino ${currentTab === "movie" ? "Cinema" : "TV Shows"}`}
          films={filipinoContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Bollywood Content - Filter by media type */}
      {bollywoodContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🎭 Bollywood (Indian ${currentTab === "movie" ? "Movies" : "TV Shows"})`}
          films={bollywoodContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Korean Content - Filter by media type */}
      {koreanContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇰🇷 Korean ${currentTab === "movie" ? "Movies" : "Drama"}`}
          films={koreanContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Japanese Content - Filter by media type */}
      {japaneseContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇯🇵 Japanese ${currentTab === "movie" ? "Movies" : "Anime"}`}
          films={japaneseContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Chinese Content - Filter by media type */}
      {chineseContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv").length > 0 && (
        <SectionSlider
          title={`🇨🇳 ${currentTab === "movie" ? "Chinese Cinema" : "C-Drama"}`}
          films={chineseContent.filter((item) => currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv")}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Genre Categories from MovieBox.ph - Properly filtered by genre and media type */}
      {(() => {
        const filtered = actionMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(28);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`💥 Action ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = comedyMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(35);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`😂 Comedy ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = dramaMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(18);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`🎭 Drama ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = thrillerMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(53);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`🔪 Thriller ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = romanceMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(10749);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`💕 Romance ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = sciFiMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(878);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`🚀 Sci-Fi ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = animationMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(16);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`🎨 Animation ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = documentaryMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(99);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`📹 Documentary ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = crimeMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(80);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`🔫 Crime ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = adventureMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(12);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`🗺️ Adventure ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {(() => {
        const filtered = fantasyMovies.filter((item) => {
          const hasGenre = item.genre_ids && item.genre_ids.includes(14);
          const matchesMediaType = currentTab === "movie" ? item.media_type === "movie" : item.media_type === "tv";
          return hasGenre && matchesMediaType;
        });
        return filtered.length > 0 ? (
          <SectionSlider
            title={`✨ Fantasy ${currentTab === "movie" ? "Movies" : "TV Shows"}`}
            films={filtered}
            limitNumber={10}
            isLoading={false}
          />
        ) : null;
      })()}

      {/* Latin American Content */}
      {latinAmericanContent.length > 0 && (
        <SectionSlider
          title="🌎 Latin American Cinema & TV Shows"
          films={latinAmericanContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Brazilian Content */}
      {brazilianContent.length > 0 && (
        <SectionSlider
          title="🇧🇷 Brazilian Cinema & TV Shows"
          films={brazilianContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Mexican Content */}
      {mexicanContent.length > 0 && (
        <SectionSlider
          title="🇲🇽 Mexican Cinema & TV Shows"
          films={mexicanContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Middle Eastern Content */}
      {middleEasternContent.length > 0 && (
        <SectionSlider
          title="🕌 Middle Eastern Cinema & TV Shows"
          films={middleEasternContent}
          limitNumber={8}
          isLoading={false}
        />
      )}
    </div>
  );
};

export default DiverseContent;
