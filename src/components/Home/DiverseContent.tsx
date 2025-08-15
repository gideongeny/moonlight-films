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
  getEnhancedKenyanContent
} from '../../services/home';
import SectionSlider from '../Slider/SectionSlider';
import Skeleton from '../Common/Skeleton';

const DiverseContent: React.FC = () => {
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
          enhancedKenya
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
          getEnhancedKenyanContent()
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
    africanTVContent.length + enhancedNollywood.length + enhancedKenyan.length;

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

      {/* Enhanced African Content */}
      {africanContent.length > 0 && (
        <SectionSlider
          title="🌍 African Cinema & TV Shows"
          films={africanContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Enhanced Nollywood Content */}
      {enhancedNollywood.length > 0 && (
        <SectionSlider
          title="🎬 Enhanced: Movies from the Nollywood industry (Nigeria)"
          films={enhancedNollywood}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Enhanced Kenyan Content */}
      {enhancedKenyan.length > 0 && (
        <SectionSlider
          title="🇰🇪 Enhanced Kenyan Content (Movies & TV Shows)"
          films={enhancedKenyan}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* African TV Content */}
      {africanTVContent.length > 0 && (
        <SectionSlider
          title="📺 African TV Shows & Series"
          films={africanTVContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* East African Content */}
      {eastAfricanContent.length > 0 && (
        <SectionSlider
          title="🌍 East African Cinema (Kenya, Tanzania, Uganda, Ethiopia)"
          films={eastAfricanContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Kenyan TV Shows */}
      {kenyanTVShows.length > 0 && (
        <SectionSlider
          title="🇰🇪 Kenyan TV Shows (Citizen TV, NTV Kenya, KTN Kenya)"
          films={kenyanTVShows}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* South African Content */}
      {southAfricanContent.length > 0 && (
        <SectionSlider
          title="🇿🇦 South African Cinema & TV Shows"
          films={southAfricanContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Nollywood Content */}
      {nollywoodContent.length > 0 && (
        <SectionSlider
          title="🎬 Movies from the Nollywood industry (Nigeria)"
          films={nollywoodContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Nigerian TV Shows */}
      {nigerianTVShows.length > 0 && (
        <SectionSlider
          title="🇳🇬 Nigerian TV Shows & Series"
          films={nigerianTVShows}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Asian Content */}
      {asianContent.length > 0 && (
        <SectionSlider
          title="🌏 Asian Cinema & TV Shows"
          films={asianContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Southeast Asian Content */}
      {southeastAsianContent.length > 0 && (
        <SectionSlider
          title="🌏 Southeast Asian Cinema (Thailand, Vietnam, Malaysia, Singapore, Indonesia)"
          films={southeastAsianContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Filipino Content */}
      {filipinoContent.length > 0 && (
        <SectionSlider
          title="🇵🇭 Filipino Cinema & TV Shows"
          films={filipinoContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Bollywood Content */}
      {bollywoodContent.length > 0 && (
        <SectionSlider
          title="🎭 Bollywood (Indian Movies & TV Shows)"
          films={bollywoodContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Korean Content */}
      {koreanContent.length > 0 && (
        <SectionSlider
          title="🇰🇷 Korean Drama & Movies"
          films={koreanContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Japanese Content */}
      {japaneseContent.length > 0 && (
        <SectionSlider
          title="🇯🇵 Japanese Anime & Movies"
          films={japaneseContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

      {/* Chinese Content */}
      {chineseContent.length > 0 && (
        <SectionSlider
          title="🇨🇳 Chinese Cinema & TV Shows"
          films={chineseContent}
          limitNumber={8}
          isLoading={false}
        />
      )}

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
