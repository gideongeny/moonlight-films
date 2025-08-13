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
  getChineseContent
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
          chinese
        ] = await Promise.all([
          getAfricanContent(),
          getAsianContent(),
          getLatinAmericanContent(),
          getMiddleEasternContent(),
          getNollywoodContent(),
          getBollywoodContent(),
          getKoreanContent(),
          getJapaneseContent(),
          getChineseContent()
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
      <div className="space-y-8">
        {[...Array(6)].map((_, index) => (
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

  return (
    <div className="space-y-8">
      {/* African Content */}
      {africanContent.length > 0 && (
        <SectionSlider
          title="🌍 African Cinema"
          films={africanContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Nollywood Content */}
      {nollywoodContent.length > 0 && (
        <SectionSlider
          title="🎬 Nollywood (Nigerian Movies)"
          films={nollywoodContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Asian Content */}
      {asianContent.length > 0 && (
        <SectionSlider
          title="🌏 Asian Cinema"
          films={asianContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Bollywood Content */}
      {bollywoodContent.length > 0 && (
        <SectionSlider
          title="🎭 Bollywood (Indian Movies)"
          films={bollywoodContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Korean Content */}
      {koreanContent.length > 0 && (
        <SectionSlider
          title="🇰🇷 Korean Drama & Movies"
          films={koreanContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Japanese Content */}
      {japaneseContent.length > 0 && (
        <SectionSlider
          title="🇯🇵 Japanese Anime & Movies"
          films={japaneseContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Chinese Content */}
      {chineseContent.length > 0 && (
        <SectionSlider
          title="🇨🇳 Chinese Cinema"
          films={chineseContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Latin American Content */}
      {latinAmericanContent.length > 0 && (
        <SectionSlider
          title="🌎 Latin American Cinema"
          films={latinAmericanContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* Middle Eastern Content */}
      {middleEasternContent.length > 0 && (
        <SectionSlider
          title="🕌 Middle Eastern Cinema"
          films={middleEasternContent}
          limitNumber={6}
          isLoading={false}
        />
      )}

      {/* No Content Message */}
      {!isLoading && 
       africanContent.length === 0 && 
       asianContent.length === 0 && 
       latinAmericanContent.length === 0 && 
       middleEasternContent.length === 0 && 
       nollywoodContent.length === 0 && 
       bollywoodContent.length === 0 && 
       koreanContent.length === 0 && 
       japaneseContent.length === 0 && 
       chineseContent.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl text-gray-400 mb-4">No Diverse Content Available</h3>
          <p className="text-gray-500">
            We're working on adding more African, Asian, and international content to our library.
            <br />
            Check back soon for updates!
          </p>
        </div>
      )}
    </div>
  );
};

export default DiverseContent;
