import axios from "../shared/axios";
import { Item } from "../shared/types";

// FZMovies CMS API integration
// This service fetches movies and TV shows from fzmovies.cms
// Similar to how moviebox.ph sources content

const FZMOVIES_BASE_URL = "https://fzmovies.cms";
const FZMOVIES_API_URL = `${FZMOVIES_BASE_URL}/api`;

// Helper function to fetch from fzmovies.cms
const fetchFZMovies = async (endpoint: string, params?: any): Promise<any> => {
  try {
    // Try direct API call first
    const response = await axios.get(`${FZMOVIES_API_URL}${endpoint}`, {
      params,
      timeout: 10000,
    });
    return response.data;
  } catch (error) {
    // Fallback: try alternative endpoints or return empty
    console.warn(`FZMovies API error for ${endpoint}:`, error);
    try {
      // Alternative: try scraping or alternative API format
      const altResponse = await axios.get(`${FZMOVIES_BASE_URL}${endpoint}`, {
        params,
        timeout: 10000,
      });
      return altResponse.data;
    } catch (altError) {
      console.warn(`FZMovies alternative endpoint also failed:`, altError);
      return { results: [], data: [] };
    }
  }
};

// Convert FZMovies item to our Item format
const convertFZMovieToItem = (item: any, mediaType: "movie" | "tv"): Item => {
  return {
    id: item.id || item.tmdb_id || item.imdb_id || Math.random() * 1000000,
    poster_path: item.poster || item.poster_path || item.thumbnail || "",
    backdrop_path: item.backdrop || item.backdrop_path || item.cover || "",
    title: item.title || item.name || "",
    name: item.name || item.title || "",
    original_title: item.original_title || item.title || "",
    original_name: item.original_name || item.name || "",
    overview: item.overview || item.description || item.plot || "",
    release_date: item.release_date || item.year || "",
    first_air_date: item.first_air_date || item.release_date || item.year || "",
    vote_average: item.rating || item.vote_average || item.imdb_rating || 0,
    vote_count: item.vote_count || item.ratings_count || 0,
    popularity: item.popularity || 0,
    genre_ids: item.genres?.map((g: any) => g.id || g) || item.genre_ids || [],
    original_language: item.language || item.original_language || "en",
    media_type: mediaType,
    adult: item.adult || false,
    origin_country: item.country || item.origin_country || [],
  };
};

// Fetch movies from fzmovies.cms
export const getFZMovies = async (
  page: number = 1,
  genre?: number,
  sortBy: string = "popularity.desc"
): Promise<Item[]> => {
  try {
    const params: any = {
      page,
      sort_by: sortBy,
    };
    
    if (genre) {
      params.genre = genre;
    }

    const data = await fetchFZMovies("/movies", params);
    
    // Handle different response formats
    const results = data.results || data.data || data.movies || data || [];
    
    return results
      .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
      .map((item: any) => convertFZMovieToItem(item, "movie"));
  } catch (error) {
    console.error("Error fetching FZMovies movies:", error);
    return [];
  }
};

// Fetch TV shows from fzmovies.cms
export const getFZTVShows = async (
  page: number = 1,
  genre?: number,
  sortBy: string = "popularity.desc"
): Promise<Item[]> => {
  try {
    const params: any = {
      page,
      sort_by: sortBy,
    };
    
    if (genre) {
      params.genre = genre;
    }

    const data = await fetchFZMovies("/tv", params);
    
    // Handle different response formats
    const results = data.results || data.data || data.shows || data.series || data || [];
    
    return results
      .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
      .map((item: any) => convertFZMovieToItem(item, "tv"));
  } catch (error) {
    console.error("Error fetching FZMovies TV shows:", error);
    return [];
  }
};

// Fetch trending content from fzmovies.cms
export const getFZTrending = async (mediaType: "movie" | "tv" | "all" = "all"): Promise<Item[]> => {
  try {
    const endpoints = [];
    if (mediaType === "all" || mediaType === "movie") {
      endpoints.push(fetchFZMovies("/trending/movies"));
    }
    if (mediaType === "all" || mediaType === "tv") {
      endpoints.push(fetchFZMovies("/trending/tv"));
    }

    const results = await Promise.all(endpoints);
    const allItems: Item[] = [];

    results.forEach((data, index) => {
      const items = data.results || data.data || data || [];
      const type = index === 0 && mediaType !== "tv" ? "movie" : "tv";
      items
        .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
        .forEach((item: any) => {
          allItems.push(convertFZMovieToItem(item, type));
        });
    });

    return allItems;
  } catch (error) {
    console.error("Error fetching FZMovies trending:", error);
    return [];
  }
};

// Fetch content by genre from fzmovies.cms
export const getFZContentByGenre = async (
  genreId: number,
  mediaType: "movie" | "tv" = "movie",
  page: number = 1
): Promise<Item[]> => {
  try {
    if (mediaType === "movie") {
      return await getFZMovies(page, genreId);
    } else {
      return await getFZTVShows(page, genreId);
    }
  } catch (error) {
    console.error(`Error fetching FZMovies content by genre ${genreId}:`, error);
    return [];
  }
};

// Search fzmovies.cms
export const searchFZMovies = async (
  query: string,
  mediaType: "movie" | "tv" | "all" = "all"
): Promise<Item[]> => {
  try {
    const endpoints = [];
    if (mediaType === "all" || mediaType === "movie") {
      endpoints.push(fetchFZMovies("/search/movies", { q: query }));
    }
    if (mediaType === "all" || mediaType === "tv") {
      endpoints.push(fetchFZMovies("/search/tv", { q: query }));
    }

    const results = await Promise.all(endpoints);
    const allItems: Item[] = [];

    results.forEach((data, index) => {
      const items = data.results || data.data || data || [];
      const type = index === 0 && mediaType !== "tv" ? "movie" : "tv";
      items
        .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
        .forEach((item: any) => {
          allItems.push(convertFZMovieToItem(item, type));
        });
    });

    return allItems;
  } catch (error) {
    console.error("Error searching FZMovies:", error);
    return [];
  }
};

// Get popular content from fzmovies.cms
export const getFZPopular = async (
  mediaType: "movie" | "tv" = "movie",
  page: number = 1
): Promise<Item[]> => {
  try {
    if (mediaType === "movie") {
      return await getFZMovies(page, undefined, "popularity.desc");
    } else {
      return await getFZTVShows(page, undefined, "popularity.desc");
    }
  } catch (error) {
    console.error("Error fetching FZMovies popular content:", error);
    return [];
  }
};

// Get top rated content from fzmovies.cms
export const getFZTopRated = async (
  mediaType: "movie" | "tv" = "movie",
  page: number = 1
): Promise<Item[]> => {
  try {
    if (mediaType === "movie") {
      return await getFZMovies(page, undefined, "vote_average.desc");
    } else {
      return await getFZTVShows(page, undefined, "vote_average.desc");
    }
  } catch (error) {
    console.error("Error fetching FZMovies top rated content:", error);
    return [];
  }
};

// Get latest content from fzmovies.cms
export const getFZLatest = async (
  mediaType: "movie" | "tv" = "movie",
  page: number = 1
): Promise<Item[]> => {
  try {
    if (mediaType === "movie") {
      return await getFZMovies(page, undefined, "release_date.desc");
    } else {
      return await getFZTVShows(page, undefined, "first_air_date.desc");
    }
  } catch (error) {
    console.error("Error fetching FZMovies latest content:", error);
    return [];
  }
};

// Get content by country/region from fzmovies.cms
export const getFZContentByCountry = async (
  countryCode: string,
  mediaType: "movie" | "tv" = "movie",
  page: number = 1
): Promise<Item[]> => {
  try {
    const params: any = {
      page,
      country: countryCode,
    };

    const endpoint = mediaType === "movie" ? "/movies" : "/tv";
    const data = await fetchFZMovies(endpoint, params);
    
    const results = data.results || data.data || data || [];
    
    return results
      .filter((item: any) => item.poster || item.poster_path || item.thumbnail)
      .map((item: any) => convertFZMovieToItem(item, mediaType));
  } catch (error) {
    console.error(`Error fetching FZMovies content by country ${countryCode}:`, error);
    return [];
  }
};

