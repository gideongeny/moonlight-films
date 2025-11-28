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

        let url = `/discover/${mediaType}?sort_by=${sortBy}`;

        // Add genre filter
        if (genres.length > 0) {
          url += `&with_genres=${genres.join(",")}`;
        }

        // Add year filter
        if (year) {
          const currentYear = new Date().getFullYear();
          if (year === "2020s") {
            url += `&primary_release_date.gte=2020-01-01&primary_release_date.lte=${currentYear}-12-31`;
          } else if (year === "2010s") {
            url += `&primary_release_date.gte=2010-01-01&primary_release_date.lte=2019-12-31`;
          } else if (year === "2000s") {
            url += `&primary_release_date.gte=2000-01-01&primary_release_date.lte=2009-12-31`;
          } else if (year === "1990s") {
            url += `&primary_release_date.gte=1990-01-01&primary_release_date.lte=1999-12-31`;
          }
        }

        // Add runtime filter
        if (runtime) {
          if (runtime === "short") {
            url += `&with_runtime.lte=90`;
          } else if (runtime === "medium") {
            url += `&with_runtime.gte=90&with_runtime.lte=150`;
          } else if (runtime === "long") {
            url += `&with_runtime.gte=150`;
          }
        }

        // Add region filter - TMDB supports pipe-delimited countries
        if (region) {
          let countries: string[] = [];
          switch (region) {
            case "africa": {
              countries = ["NG", "KE", "TZ", "UG", "ET", "RW", "ZM", "GH", "ZA", "EG"];
              break;
            }
            case "asia": {
              countries = ["KR", "JP", "CN", "IN"];
              break;
            }
            case "latin": {
              countries = ["MX", "BR", "AR", "CO"];
              break;
            }
            case "middleeast": {
              countries = ["TR", "EG", "SA", "AE"];
              break;
            }
            case "nollywood":
              countries = ["NG"];
              break;
            case "bollywood":
              countries = ["IN"];
              break;
            case "korea":
              countries = ["KR"];
              break;
            case "japan":
              countries = ["JP"];
              break;
            case "china":
              countries = ["CN"];
              break;
            case "philippines":
              countries = ["PH"];
              break;
            case "kenya":
              countries = ["KE"];
              break;
          }
          
          if (countries.length > 0) {
            // TMDB accepts pipe-delimited countries
            url += `&with_origin_country=${countries.join("|")}`;
          }
        }

        // Add page parameter to avoid 404
        url += `&page=1`;

        const response = await axios.get(url, {
          timeout: 10000,
        });
        const results: Item[] = (response.data.results || []).map((item: any) => ({
          ...item,
          media_type: mediaType,
        }));
        setData(results);
      } catch (err) {
        console.error("Error fetching collection data:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch data");
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
