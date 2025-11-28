import axios from "../shared/axios";

import { ConfigType, Item, ItemsPage } from "../shared/types";
import { getFZContentByGenre, getFZContentByCountry } from "./fzmovies";
import { getAllAPIContentByGenre } from "./movieAPIs";
import { getAllSourceContent } from "./contentSources";

export const getExploreMovie: (
  page: number,
  config?: ConfigType
) => Promise<ItemsPage> = async (page, config = {}) => {
  // If genre is specified, ensure proper filtering
  const genreId = config.with_genres ? Number(config.with_genres) : undefined;
  // Get origin_country filter if specified
  const originCountry = config.with_origin_country || (config as any).region;
  
  // Enhanced: Fetch from multiple sources in parallel for better regional content
  const fetchPromises = [
    // Primary: TMDB discover
    axios.get("/discover/movie", {
      params: {
        ...config,
        page,
        // Ensure genre filtering is applied
        ...(genreId && { with_genres: genreId }),
        // Ensure origin_country filtering is applied
        ...(originCountry && { with_origin_country: originCountry }),
      },
      timeout: 10000,
    }).catch(() => ({ data: { results: [] } })),
    
    // Fallback: TMDB popular (always works)
    axios.get("/movie/popular", {
      params: { page },
      timeout: 8000,
    }).catch(() => ({ data: { results: [] } })),
    
    // Fallback: TMDB trending
    axios.get("/trending/movie/day", {
      params: { page },
      timeout: 8000,
    }).catch(() => ({ data: { results: [] } })),
    
    // FZMovies content
    genreId 
      ? getFZContentByGenre(genreId, "movie", page).catch(() => [])
      : Promise.resolve([]),
    
    // Additional API content
    genreId
      ? getAllAPIContentByGenre(genreId, "movie").catch(() => [])
      : Promise.resolve([]),
    
    // Content sources (KissKH, Ailok, Googotv, FZMovies)
    getAllSourceContent("movie", page).catch(() => []),
    
    // Regional content sources if origin_country is specified
    originCountry
      ? Promise.all(
          (typeof originCountry === 'string' ? originCountry.split('|') : [originCountry])
            .slice(0, 3) // Limit to first 3 countries to avoid too many requests
            .map(country => getFZContentByCountry(country, "movie", page).catch(() => []))
        ).then(results => results.flat()).catch(() => [])
      : Promise.resolve([]),
  ];
  
  const [tmdbData, popularData, trendingData, fzMovies, apiContent, sourceContent, regionalContent] = await Promise.all(fetchPromises);

  // Combine all TMDB results (discover, popular, trending)
  const allTmdbResults = [
    ...(tmdbData.data?.results || []),
    ...(popularData.data?.results || []),
    ...(trendingData.data?.results || []),
  ];
  
  const tmdbItems = allTmdbResults
    .filter((item: Item) => {
      // If genre filter is applied, ensure item has that genre
      if (genreId && item.genre_ids) {
        if (!item.genre_ids.includes(genreId)) return false;
      }
      // If origin_country filter is applied, ensure item matches
      if (originCountry) {
        const countries = item.origin_country || [];
        const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
        if (!countries.some((c: string) => filterCountries.includes(c))) {
          return false;
        }
      }
      return item.poster_path;
    })
    .map((item: Item) => ({
      ...item,
      media_type: "movie",
    }));

  // Filter API content by genre and origin_country if specified
  let filteredApiContent = apiContent;
  if (genreId) {
    filteredApiContent = filteredApiContent.filter((item: Item) => 
      item.genre_ids && item.genre_ids.includes(genreId)
    );
  }
  if (originCountry) {
    const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
    filteredApiContent = filteredApiContent.filter((item: Item) => {
      const countries = item.origin_country || [];
      return countries.some((c: string) => filterCountries.includes(c));
    });
  }
  
  // Filter source content by origin_country if specified
  let filteredSourceContent = sourceContent;
  if (originCountry) {
    const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
    filteredSourceContent = filteredSourceContent.filter((item: Item) => {
      const countries = item.origin_country || [];
      return countries.some((c: string) => filterCountries.includes(c));
    });
  }

  // Merge with FZMovies, API content, source content, and regional content
  const combined = [...tmdbItems, ...fzMovies, ...filteredApiContent, ...filteredSourceContent, ...regionalContent];
  const seen = new Set<number>();
  const adjustedItems = combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    // Final genre check
    if (genreId && item.genre_ids && !item.genre_ids.includes(genreId)) {
      return false;
    }
    // Final origin_country check
    if (originCountry) {
      const countries = item.origin_country || [];
      const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
      if (!countries.some((c: string) => filterCountries.includes(c))) {
        return false;
      }
    }
    return item.poster_path;
  });

  return {
    ...tmdbData.data,
    results: adjustedItems,
    total_results: adjustedItems.length, // Update total to reflect merged results
  };
};

export const getExploreTV: (
  page: number,
  config?: ConfigType
) => Promise<ItemsPage> = async (page, config = {}) => {
  // If genre is specified, ensure proper filtering
  const genreId = config.with_genres ? Number(config.with_genres) : undefined;
  // Get origin_country filter if specified
  const originCountry = config.with_origin_country || (config as any).region;
  
  // Enhanced: Fetch from multiple sources in parallel for better regional content
  const fetchPromises = [
    // Primary: TMDB discover
    axios.get("/discover/tv", {
      params: {
        ...config,
        page,
        // Ensure genre filtering is applied
        ...(genreId && { with_genres: genreId }),
        // Ensure origin_country filtering is applied
        ...(originCountry && { with_origin_country: originCountry }),
      },
      timeout: 10000,
    }).catch(() => ({ data: { results: [] } })),
    
    // Fallback: TMDB popular (always works)
    axios.get("/tv/popular", {
      params: { page },
      timeout: 8000,
    }).catch(() => ({ data: { results: [] } })),
    
    // Fallback: TMDB trending
    axios.get("/trending/tv/day", {
      params: { page },
      timeout: 8000,
    }).catch(() => ({ data: { results: [] } })),
    
    // FZMovies content
    genreId 
      ? getFZContentByGenre(genreId, "tv", page).catch(() => [])
      : Promise.resolve([]),
    
    // Additional API content
    genreId
      ? getAllAPIContentByGenre(genreId, "tv").catch(() => [])
      : Promise.resolve([]),
    
    // Content sources (KissKH, Ailok, Googotv, FZMovies) - especially good for Asian content
    getAllSourceContent("tv", page).catch(() => []),
    
    // Regional content sources if origin_country is specified
    originCountry
      ? Promise.all(
          (typeof originCountry === 'string' ? originCountry.split('|') : [originCountry])
            .slice(0, 3) // Limit to first 3 countries to avoid too many requests
            .map(country => getFZContentByCountry(country, "tv", page).catch(() => []))
        ).then(results => results.flat()).catch(() => [])
      : Promise.resolve([]),
  ];
  
  const [tmdbData, popularData, trendingData, fzTV, apiContent, sourceContent, regionalContent] = await Promise.all(fetchPromises);

  // Combine all TMDB results (discover, popular, trending)
  const allTmdbResults = [
    ...(tmdbData.data?.results || []),
    ...(popularData.data?.results || []),
    ...(trendingData.data?.results || []),
  ];
  
  const tmdbItems = allTmdbResults
    .filter((item: Item) => {
      // Must have poster
      if (!item.poster_path) return false;
      
      // If genre filter is applied, ensure item has that genre
      if (genreId && item.genre_ids) {
        if (!item.genre_ids.includes(genreId)) return false;
      }
      // If origin_country filter is applied, ensure item matches - STRICT FILTERING
      if (originCountry) {
        const countries = item.origin_country || [];
        const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
        // Only include if at least one country matches
        const hasMatchingCountry = countries.some((c: string) => filterCountries.includes(c));
        if (!hasMatchingCountry) {
          return false; // Strictly filter out items that don't match
        }
      }
      return true;
    })
    .map((item: any) => ({
      ...item,
      media_type: "tv",
    }));

  // Filter API content by genre and origin_country if specified
  let filteredApiContent = apiContent;
  if (genreId) {
    filteredApiContent = filteredApiContent.filter((item: Item) => 
      item.genre_ids && item.genre_ids.includes(genreId)
    );
  }
  if (originCountry) {
    const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
    filteredApiContent = filteredApiContent.filter((item: Item) => {
      const countries = item.origin_country || [];
      return countries.some((c: string) => filterCountries.includes(c));
    });
  }
  
  // Filter source content by origin_country if specified
  let filteredSourceContent = sourceContent;
  if (originCountry) {
    const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
    filteredSourceContent = filteredSourceContent.filter((item: Item) => {
      const countries = item.origin_country || [];
      return countries.some((c: string) => filterCountries.includes(c));
    });
  }

  // Merge with FZMovies, API content, source content, and regional content
  const combined = [...tmdbItems, ...fzTV, ...filteredApiContent, ...filteredSourceContent, ...regionalContent];
  const seen = new Set<number>();
  const adjustedItems = combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    // Final genre check
    if (genreId && item.genre_ids && !item.genre_ids.includes(genreId)) {
      return false;
    }
    // Final origin_country check
    if (originCountry) {
      const countries = item.origin_country || [];
      const filterCountries = typeof originCountry === 'string' ? originCountry.split('|') : [originCountry];
      if (!countries.some((c: string) => filterCountries.includes(c))) {
        return false;
      }
    }
    return item.poster_path;
  });

  return {
    ...tmdbData.data,
    results: adjustedItems,
    total_results: adjustedItems.length, // Update total to reflect merged results
  };
};
