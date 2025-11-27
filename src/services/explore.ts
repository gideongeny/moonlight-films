import axios from "../shared/axios";

import { ConfigType, Item, ItemsPage } from "../shared/types";
import { getFZContentByGenre } from "./fzmovies";
import { getAllAPIContentByGenre, getTMDBByGenre } from "./movieAPIs";

export const getExploreMovie: (
  page: number,
  config?: ConfigType
) => Promise<ItemsPage> = async (page, config = {}) => {
  // If genre is specified, ensure proper filtering
  const genreId = config.with_genres ? Number(config.with_genres) : undefined;
  
  const [tmdbData, fzMovies, apiContent] = await Promise.all([
    axios.get("/discover/movie", {
      params: {
        ...config,
        page,
        // Ensure genre filtering is applied
        ...(genreId && { with_genres: genreId }),
      },
    }),
    // Fetch from FZMovies if genre is specified
    genreId 
      ? getFZContentByGenre(genreId, "movie", page)
      : Promise.resolve([]),
    // Fetch from all APIs if genre is specified
    genreId
      ? getAllAPIContentByGenre(genreId, "movie")
      : Promise.resolve([]),
  ]);

  const tmdbItems = (tmdbData.data.results || [])
    .filter((item: Item) => {
      // If genre filter is applied, ensure item has that genre
      if (genreId && item.genre_ids) {
        return item.poster_path && item.genre_ids.includes(genreId);
      }
      return item.poster_path;
    })
    .map((item: Item) => ({
      ...item,
      media_type: "movie",
    }));

  // Filter API content by genre if specified
  const filteredApiContent = genreId
    ? apiContent.filter((item: Item) => 
        item.genre_ids && item.genre_ids.includes(genreId)
      )
    : apiContent;

  // Merge with FZMovies and API content
  const combined = [...tmdbItems, ...fzMovies, ...filteredApiContent];
  const seen = new Set<number>();
  const adjustedItems = combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    // Final genre check
    if (genreId && item.genre_ids && !item.genre_ids.includes(genreId)) {
      return false;
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
  
  const [tmdbData, fzTV, apiContent] = await Promise.all([
    axios.get("/discover/tv", {
      params: {
        ...config,
        page,
        // Ensure genre filtering is applied
        ...(genreId && { with_genres: genreId }),
      },
    }),
    // Fetch from FZMovies if genre is specified
    genreId 
      ? getFZContentByGenre(genreId, "tv", page)
      : Promise.resolve([]),
    // Fetch from all APIs if genre is specified
    genreId
      ? getAllAPIContentByGenre(genreId, "tv")
      : Promise.resolve([]),
  ]);

  const tmdbItems = (tmdbData.data.results || [])
    .filter((item: Item) => {
      // If genre filter is applied, ensure item has that genre
      if (genreId && item.genre_ids) {
        return item.poster_path && item.genre_ids.includes(genreId);
      }
      return item.poster_path;
    })
    .map((item: any) => ({
      ...item,
      media_type: "tv",
    }));

  // Filter API content by genre if specified
  const filteredApiContent = genreId
    ? apiContent.filter((item: Item) => 
        item.genre_ids && item.genre_ids.includes(genreId)
      )
    : apiContent;

  // Merge with FZMovies and API content
  const combined = [...tmdbItems, ...fzTV, ...filteredApiContent];
  const seen = new Set<number>();
  const adjustedItems = combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    // Final genre check
    if (genreId && item.genre_ids && !item.genre_ids.includes(genreId)) {
      return false;
    }
    return item.poster_path;
  });

  return {
    ...tmdbData.data,
    results: adjustedItems,
    total_results: adjustedItems.length, // Update total to reflect merged results
  };
};
