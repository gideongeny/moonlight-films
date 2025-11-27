import axios from "../shared/axios";

import { ConfigType, Item, ItemsPage } from "../shared/types";
import { getFZContentByGenre } from "./fzmovies";

export const getExploreMovie: (
  page: number,
  config?: ConfigType
) => Promise<ItemsPage> = async (page, config = {}) => {
  const [tmdbData, fzMovies] = await Promise.all([
    axios.get("/discover/movie", {
      params: {
        ...config,
        page,
      },
    }),
    // Fetch from FZMovies if genre is specified
    config.with_genres 
      ? getFZContentByGenre(Number(config.with_genres), "movie", page)
      : Promise.resolve([]),
  ]);

  const tmdbItems = tmdbData.data.results
    .filter((item: Item) => item.poster_path)
    .map((item: Item) => ({
      ...item,
      media_type: "movie",
    }));

  // Merge with FZMovies content
  const combined = [...tmdbItems, ...fzMovies];
  const seen = new Set<number>();
  const adjustedItems = combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
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
  const [tmdbData, fzTV] = await Promise.all([
    axios.get("/discover/tv", {
      params: {
        ...config,
        page,
      },
    }),
    // Fetch from FZMovies if genre is specified
    config.with_genres 
      ? getFZContentByGenre(Number(config.with_genres), "tv", page)
      : Promise.resolve([]),
  ]);

  const tmdbItems = tmdbData.data.results
    .filter((item: Item) => item.poster_path)
    .map((item: any) => ({
      ...item,
      media_type: "tv",
    }));

  // Merge with FZMovies content
  const combined = [...tmdbItems, ...fzTV];
  const seen = new Set<number>();
  const adjustedItems = combined.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return item.poster_path;
  });

  return {
    ...tmdbData.data,
    results: adjustedItems,
    total_results: adjustedItems.length, // Update total to reflect merged results
  };
};
