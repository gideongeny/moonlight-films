// Content Sources Integration
// Fetches movies and TV shows from multiple sources and merges with TMDB

import axios from "../shared/axios";
import { Item } from "../shared/types";

// Helper to convert any content item to our Item format
const convertToItem = (item: any, mediaType: "movie" | "tv"): Item => {
  return {
    id: item.id || item.tmdb_id || item.imdb_id || Math.random() * 1000000,
    poster_path: item.poster || item.poster_path || item.thumbnail || item.image || "",
    backdrop_path: item.backdrop || item.backdrop_path || item.cover || item.banner || "",
    title: item.title || item.name || "",
    name: item.name || item.title || "",
    original_title: item.original_title || item.title || "",
    original_name: item.original_name || item.name || "",
    overview: item.overview || item.description || item.plot || item.synopsis || "",
    release_date: item.release_date || item.year || item.released || "",
    first_air_date: item.first_air_date || item.release_date || item.year || item.released || "",
    vote_average: item.rating || item.vote_average || item.imdb_rating || item.score || 0,
    vote_count: item.vote_count || item.ratings_count || 0,
    genre_ids: item.genre_ids || item.genres?.map((g: any) => g.id || g) || [],
    original_language: item.original_language || item.language || "en",
    popularity: item.popularity || 0,
    media_type: mediaType,
    origin_country: item.country || item.origin_country || [],
  };
};

// KissKH.com - Anime and Asian content
export const getKissKHContent = async (page: number = 1, type: "movie" | "tv" = "tv"): Promise<Item[]> => {
  try {
    const endpoint = type === "movie" ? "/api/movies" : "/api/dramas";
    const response = await axios.get(`https://kisskh.com${endpoint}`, {
      params: { page },
      timeout: 10000,
    });
    
    const results = response.data?.data || response.data?.results || response.data || [];
    return results
      .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
      .map((item: any) => convertToItem(item, type));
  } catch (error) {
    console.warn("KissKH API error:", error);
    return [];
  }
};

// UGC-Anime.com - Anime content
export const getUGCAnimeContent = async (page: number = 1): Promise<Item[]> => {
  try {
    const response = await axios.get("https://ugc-anime.com/api/anime", {
      params: { page, limit: 20 },
      timeout: 10000,
    });
    
    const results = response.data?.data || response.data?.results || response.data || [];
    return results
      .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
      .map((item: any) => convertToItem(item, "tv"));
  } catch (error) {
    console.warn("UGC-Anime API error:", error);
    return [];
  }
};

// Ailok.pe - Movies and TV shows
export const getAilokContent = async (page: number = 1, type: "movie" | "tv" = "movie"): Promise<Item[]> => {
  try {
    const endpoint = type === "movie" ? "/api/movies" : "/api/series";
    const response = await axios.get(`https://ailok.pe${endpoint}`, {
      params: { page },
      timeout: 10000,
    });
    
    const results = response.data?.data || response.data?.results || response.data || [];
    return results
      .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
      .map((item: any) => convertToItem(item, type));
  } catch (error) {
    console.warn("Ailok API error:", error);
    return [];
  }
};

// SZ.Googotv.com - Movies and TV shows
export const getGoogotvContent = async (page: number = 1, type: "movie" | "tv" = "movie"): Promise<Item[]> => {
  try {
    const endpoint = type === "movie" ? "/api/movies" : "/api/tv";
    const response = await axios.get(`https://sz.googotv.com${endpoint}`, {
      params: { page },
      timeout: 10000,
    });
    
    const results = response.data?.data || response.data?.results || response.data || [];
    return results
      .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
      .map((item: any) => convertToItem(item, type));
  } catch (error) {
    console.warn("Googotv API error:", error);
    return [];
  }
};

// YouTube - Search for movie/TV trailers and content
export const getYouTubeContent = async (query: string, page: number = 1): Promise<Item[]> => {
  try {
    // Note: YouTube API requires API key, but we can use search results
    // For now, return empty and let TMDB handle it
    // In production, you'd use YouTube Data API v3
    return [];
  } catch (error) {
    console.warn("YouTube API error:", error);
    return [];
  }
};

// Merge content from all sources
export const mergeContentSources = async (
  tmdbContent: Item[],
  additionalSources: Item[][]
): Promise<Item[]> => {
  const allContent = [...tmdbContent];
  
  // Add content from additional sources
  additionalSources.forEach((sourceContent) => {
    allContent.push(...sourceContent);
  });
  
  // Remove duplicates by ID
  const uniqueContent = allContent.filter((item, index, self) =>
    index === self.findIndex((i) => i.id === item.id)
  );
  
  return uniqueContent;
};

// Get content from all sources for a specific category
export const getAllSourceContent = async (
  type: "movie" | "tv",
  page: number = 1
): Promise<Item[]> => {
  try {
    const [kisskh, ugcAnime, ailok, googotv] = await Promise.all([
      getKissKHContent(page, type),
      type === "tv" ? getUGCAnimeContent(page) : Promise.resolve([]),
      getAilokContent(page, type),
      getGoogotvContent(page, type),
    ]);
    
    return mergeContentSources([], [kisskh, ugcAnime, ailok, googotv]);
  } catch (error) {
    console.error("Error fetching all source content:", error);
    return [];
  }
};

