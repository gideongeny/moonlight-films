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

        // Add region filter
        if (region) {
          switch (region) {
            case "africa": {
              // Broaden coverage and use pipe-delimited multi-country filter (TMDB expects a single param)
              const africanCountries = [
                "NG", // Nigeria
                "KE", // Kenya
                "TZ", // Tanzania
                "UG", // Uganda
                "ET", // Ethiopia
                "RW", // Rwanda
                "ZM", // Zambia
                "GH", // Ghana
                "ZA", // South Africa
                "EG"  // Egypt
              ].join("|");
              url += `&with_origin_country=${africanCountries}`;
              break;
            }
            case "asia": {
              const asianCountries = ["KR", "JP", "CN", "IN"].join("|");
              url += `&with_origin_country=${asianCountries}`;
              break;
            }
            case "latin": {
              const latinCountries = ["MX", "BR", "AR", "CO"].join("|");
              url += `&with_origin_country=${latinCountries}`;
              break;
            }
            case "middleeast": {
              const middleEastCountries = ["TR", "EG", "SA", "AE"].join("|");
              url += `&with_origin_country=${middleEastCountries}`;
              break;
            }
            case "nollywood":
              // Focus on Nigerian productions (industry-based wording will be handled in UI labels)
              url += `&with_origin_country=NG`;
              break;
            case "bollywood":
              url += `&with_origin_country=IN`;
              break;
            case "korea":
              url += `&with_origin_country=KR`;
              break;
            case "japan":
              url += `&with_origin_country=JP`;
              break;
            case "china":
              url += `&with_origin_country=CN`;
              break;
            case "philippines":
              url += `&with_origin_country=PH`;
              break;
            case "kenya":
              url += `&with_origin_country=KE`;
              break;
          }
        }

        const response = await axios.get(url);
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
