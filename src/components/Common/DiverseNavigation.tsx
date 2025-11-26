import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { IMAGE_URL } from '../../shared/constants';
import axios from '../../shared/axios';
import { Item } from '../../shared/types';

interface NavigationItem {
  title: string;
  description: string;
  path: string;
  image?: string;
  fallbackImage: string;
  fetchQuery?: { region?: string; with_origin_country?: string; with_genres?: string };
}

const DiverseNavigation: React.FC = () => {
  const [navigationItems, setNavigationItems] = useState<NavigationItem[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const baseItems: NavigationItem[] = [
        {
          title: "African Cinema",
          description: "Nollywood, South African, Kenyan & more",
          path: "/explore?region=africa",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "NG|ZA|KE|GH" }
        },
        {
          title: "Asian Cinema",
          description: "Bollywood, Korean, Japanese, Chinese",
          path: "/explore?region=asia",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "IN|KR|JP|CN" }
        },
        {
          title: "Latin American",
          description: "Mexican, Brazilian, Argentine cinema",
          path: "/explore?region=latin",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "MX|BR|AR" }
        },
        {
          title: "Middle Eastern",
          description: "Turkish, Egyptian, Saudi cinema",
          path: "/explore?region=middleeast",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "TR|EG|SA" }
        },
        {
          title: "Nollywood",
          description: "Movies from the Nollywood industry (Nigeria)",
          path: "/explore?region=nollywood",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "NG" }
        },
        {
          title: "Bollywood",
          description: "Indian movies & TV shows",
          path: "/explore?region=bollywood",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "IN" }
        },
        {
          title: "Filipino",
          description: "ABS-CBN, iWantTFC shows & films",
          path: "/explore?region=philippines",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "PH" }
        },
        {
          title: "Kenyan",
          description: "Citizen, NTV, KTN, Showmax",
          path: "/explore?region=kenya",
          fallbackImage: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1280&h=720&fit=crop",
          fetchQuery: { with_origin_country: "KE" }
        }
      ];

      const updatedItems = await Promise.all(
        baseItems.map(async (item) => {
          if (!item.fetchQuery) return item;
          
          // Try multiple sources with fallbacks
          const sources = [
            // Source 1: Primary TMDB discover
            async () => {
              const response = await axios.get('/discover/movie', {
                params: {
                  ...item.fetchQuery,
                  sort_by: 'popularity.desc',
                  page: 1,
                  'vote_count.gte': 10
                }
              });
              const movies: Item[] = response.data.results || [];
              if (movies.length > 0 && movies[0].backdrop_path) {
                return `${IMAGE_URL}/w1280${movies[0].backdrop_path}`;
              }
              return null;
            },
            // Source 2: Try page 2
            async () => {
              const response = await axios.get('/discover/movie', {
                params: {
                  ...item.fetchQuery,
                  sort_by: 'popularity.desc',
                  page: 2,
                  'vote_count.gte': 5
                }
              });
              const movies: Item[] = response.data.results || [];
              if (movies.length > 0 && movies[0].backdrop_path) {
                return `${IMAGE_URL}/w1280${movies[0].backdrop_path}`;
              }
              return null;
            },
            // Source 3: Try trending
            async () => {
              const response = await axios.get('/trending/movie/day', {
                params: { page: 1 }
              });
              const movies: Item[] = response.data.results || [];
              if (movies.length > 0 && movies[0].backdrop_path) {
                return `${IMAGE_URL}/w1280${movies[0].backdrop_path}`;
              }
              return null;
            },
            // Source 4: Try popular movies
            async () => {
              const response = await axios.get('/movie/popular', {
                params: { page: 1 }
              });
              const movies: Item[] = response.data.results || [];
              if (movies.length > 0 && movies[0].backdrop_path) {
                return `${IMAGE_URL}/w1280${movies[0].backdrop_path}`;
              }
              return null;
            },
            // Source 5: Try top rated
            async () => {
              const response = await axios.get('/movie/top_rated', {
                params: { page: 1 }
              });
              const movies: Item[] = response.data.results || [];
              if (movies.length > 0 && movies[0].backdrop_path) {
                return `${IMAGE_URL}/w1280${movies[0].backdrop_path}`;
              }
              return null;
            },
          ];

          for (const source of sources) {
            try {
              const imageUrl = await source();
              if (imageUrl) {
                return { ...item, image: imageUrl };
              }
            } catch (error) {
              // Continue to next source
            }
          }
          
          return item;
        })
      );
      
      setNavigationItems(updatedItems);
    };

    fetchImages();
  }, []); // Only run once on mount

  return (
    <div className="py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">
          🌍 Discover World Cinema
        </h2>
        <p className="text-gray-400 text-lg">
          Explore movies and TV shows from around the world
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto px-4">
        {navigationItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="group block"
          >
            <div className="relative h-48 rounded-xl overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-2xl border border-gray-700/50">
              {item.image ? (
                <LazyLoadImage
                  src={item.image}
                  alt={item.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  effect="blur"
                  onError={(e: any) => {
                    e.target.src = item.fallbackImage;
                  }}
                />
              ) : (
                <div 
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{
                    backgroundImage: `url(${item.fallbackImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/30"></div>
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                <h3 className="text-xl font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-2 text-white/80 text-sm">
                  <span>Explore Now</span>
                  <span className="ml-auto group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-500 text-sm">
          Click on any category above to explore movies and TV shows from that region
        </p>
      </div>
    </div>
  );
};

export default DiverseNavigation;
