import { useState, useEffect } from "react";
import { Item } from "../shared/types";
import axios from "../shared/axios";
import {
  CollectionReference,
  DocumentData,
  onSnapshot,
  Query,
  QuerySnapshot,
} from "firebase/firestore";

interface TMDBCollectionQueryParams {
  mediaType: "movie" | "tv";
  sortBy: string;
  genres: number[];
  year: string;
  runtime: string;
  region: string;
}

interface TMDBCollectionQueryResult {
  data: Item[];
  isLoading: boolean;
  error: string | null;
}

export const useTMDBCollectionQuery = (
  mediaType: "movie" | "tv",
  sortBy: string = "popularity.desc",
  genres: number[] = [],
  year: string = "",
  runtime: string = "",
  region: string = ""
): TMDBCollectionQueryResult => {
  const [data, setData] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Get target countries for region filter (for client-side filtering)
        let targetCountries: string[] = [];
        if (region) {
          switch (region) {
            case "africa": {
              targetCountries = ["NG", "KE", "TZ", "UG", "ET", "RW", "ZM", "GH", "ZA", "EG"];
              break;
            }
            case "asia": {
              targetCountries = ["KR", "JP", "CN", "IN"];
              break;
            }
            case "latin": {
              targetCountries = ["MX", "BR", "AR", "CO"];
              break;
            }
            case "middleeast": {
              targetCountries = ["TR", "EG", "SA", "AE"];
              break;
            }
            case "nollywood":
              targetCountries = ["NG"];
              break;
            case "bollywood":
              targetCountries = ["IN"];
              break;
            case "korea":
              targetCountries = ["KR"];
              break;
            case "japan":
              targetCountries = ["JP"];
              break;
            case "china":
              targetCountries = ["CN"];
              break;
            case "philippines":
              targetCountries = ["PH"];
              break;
            case "kenya":
              targetCountries = ["KE"];
              break;
          }
        }

        // MovieBox-style: Fetch from multiple reliable endpoints, then filter client-side
        // This avoids 404 errors from strict region filtering
        const fetchPromises = [
          // Primary: Try discover endpoint (works most of the time)
          axios.get(`/discover/${mediaType}`, {
            params: {
              sort_by: sortBy,
              page: 1,
              ...(genres.length > 0 && { with_genres: genres.join(",") }),
            },
            timeout: 8000,
          }).catch(() => null),
          
          // Fallback 1: Popular endpoint (always works)
          axios.get(`/${mediaType}/popular`, {
            params: { page: 1 },
            timeout: 8000,
          }).catch(() => null),
          
          // Fallback 2: Trending endpoint (always works)
          axios.get(`/trending/${mediaType}/day`, {
            params: { page: 1 },
            timeout: 8000,
          }).catch(() => null),
          
          // Fallback 3: Top rated endpoint (always works)
          axios.get(`/${mediaType}/top_rated`, {
            params: { page: 1 },
            timeout: 8000,
          }).catch(() => null),
        ];

        // Wait for at least one successful response
        const responses = await Promise.allSettled(fetchPromises);
        let allResults: Item[] = [];

        // Collect results from all successful responses
        for (const response of responses) {
          if (response.status === "fulfilled" && response.value?.data?.results) {
            const items = (response.value.data.results || []).map((item: any) => ({
              ...item,
              media_type: mediaType,
            }));
            allResults.push(...items);
          }
        }

        // Remove duplicates by ID
        const uniqueResults = allResults.filter((item, index, self) =>
          index === self.findIndex((i) => i.id === item.id)
        );

        // Apply client-side filters (like MovieBox does)
        let filteredResults = uniqueResults;

        // Filter by genre (client-side)
        if (genres.length > 0) {
          filteredResults = filteredResults.filter((item) =>
            item.genre_ids && genres.some((genreId) => item.genre_ids?.includes(genreId))
          );
        }

        // Filter by year (client-side)
        if (year) {
          const currentYear = new Date().getFullYear();
          let startYear = 0;
          let endYear = currentYear;
          
          if (year === "2020s") {
            startYear = 2020;
            endYear = currentYear;
          } else if (year === "2010s") {
            startYear = 2010;
            endYear = 2019;
          } else if (year === "2000s") {
            startYear = 2000;
            endYear = 2009;
          } else if (year === "1990s") {
            startYear = 1990;
            endYear = 1999;
          }
          
          filteredResults = filteredResults.filter((item) => {
            const releaseDate = mediaType === "movie" 
              ? item.release_date 
              : item.first_air_date;
            if (!releaseDate) return false;
            const itemYear = parseInt(releaseDate.split("-")[0]);
            return itemYear >= startYear && itemYear <= endYear;
          });
        }

        // Filter by runtime (client-side)
        if (runtime) {
          filteredResults = filteredResults.filter((item) => {
            const itemRuntime = (item as any).runtime || 0;
            if (runtime === "short") return itemRuntime <= 90;
            if (runtime === "medium") return itemRuntime >= 90 && itemRuntime <= 150;
            if (runtime === "long") return itemRuntime >= 150;
            return true;
          });
        }

        // Filter by region (client-side) - STRICT FILTERING
        if (targetCountries.length > 0) {
          filteredResults = filteredResults.filter((item) => {
            const countries = item.origin_country || [];
            // Only include if at least one country matches
            return countries.some((c: string) => targetCountries.includes(c));
          });
        }

        // Sort results
        if (sortBy === "popularity.desc") {
          filteredResults.sort((a, b) => (b.popularity || 0) - (a.popularity || 0));
        } else if (sortBy === "vote_average.desc") {
          filteredResults.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        } else if (sortBy === "release_date.desc") {
          filteredResults.sort((a, b) => {
            const dateA = mediaType === "movie" ? a.release_date : a.first_air_date;
            const dateB = mediaType === "movie" ? b.release_date : b.first_air_date;
            return (dateB || "").localeCompare(dateA || "");
          });
        }

        // Limit to reasonable number and ensure posters exist
        filteredResults = filteredResults
          .filter((item) => item.poster_path)
          .slice(0, 100); // Limit to 100 items

        setData(filteredResults);
      } catch (err) {
        console.error("Error fetching collection data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
        setData([]); // Set empty array on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [mediaType, sortBy, genres, year, runtime, region]);

  return { data, isLoading, error };
};

// Keep the old Firebase hook for backward compatibility
export const useCollectionQuery: (
  id: number | string | undefined,
  collection: CollectionReference | Query<DocumentData>
) => {
  isLoading: boolean;
  isError: boolean;
  data: QuerySnapshot<DocumentData> | null;
} = (id, collection) => {
  const [data, setData] = useState<QuerySnapshot<DocumentData> | null>(null);
  const [isLoading, setIsLoading] = useState(!Boolean(data));
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection,
      (querySnapshot) => {
        setData(querySnapshot);
        setIsLoading(false);
        setIsError(false);
      },
      (error) => {
        console.log(error, 111);
        setData(null);
        setIsLoading(false);
        setIsError(true);
      }
    );

    return () => unsubscribe();
  }, [id]);

  return { isLoading, isError, data };
};
