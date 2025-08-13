import axios from "../shared/axios";
import { BannerInfo, Item, DetailMovie, DetailTV } from "../shared/types";
import { HomeFilms } from "../shared/types";
import { API_URL } from "../shared/constants";

// MOVIE TAB
///////////////////////////////////////////////////////////////
export const getHomeMovies = async (): Promise<HomeFilms> => {
  const endpoints: { [key: string]: string } = {
    Trending: "/trending/movie/day",
    Popular: "/movie/popular",
    "Top Rated": "/movie/top_rated",
    Hot: "/trending/movie/day?page=2",
    Upcoming: "/movie/upcoming",
  };

  const responses = await Promise.all(
    Object.entries(endpoints).map((endpoint) => axios.get(endpoint[1]))
  );

  const data = responses.reduce((final, current, index) => {
    final[Object.entries(endpoints)[index][0]] = current.data.results.map(
      (item: Item) => ({
        ...item,
        media_type: "movie",
      })
    );

    return final;
  }, {} as HomeFilms);

  return data;
};

export const getMovieBannerInfo = async (
  movies: Item[]
): Promise<BannerInfo[]> => {
  const detailRes = await Promise.all(
    movies.map((movie) => axios.get(`/movie/${movie.id}`))
  );

  const translationRes = await Promise.all(
    movies.map((movie) => axios.get(`/movie/${movie.id}/translations`))
  );

  const translations: string[][] = translationRes.map((item: any) =>
    item.data.translations
      .filter((translation: any) =>
        ["en", "sw", "fr", "es", "pt", "de", "it", "ru", "ja", "ko", "zh", "ar", "hi"].includes(translation.iso_639_1)
      )
      .reduce((acc: any, element: any) => {
        if (element.iso_639_1 === "en") {
          return [element, ...acc];
        } else if (element.iso_639_1 === "sw") {
          return [element, ...acc];
        }
        return [...acc, element];
      }, [] as any)
      .map((translation: any) => translation.data.title)
  );

  // translations will look like: [["Doctor Strange", "Daktari Strange", "Doctor Strange", "Dr. Strange"],["Spider Man Far From Home", "Spider Man Mbali na Nyumbani", "Spider-Man Lejos de Casa"],...]

  const genres: { name: string; id: number }[][] = detailRes.map((item: any) =>
    item.data.genres.filter((_: any, index: number) => index < 3)
  );

  // genres will look like: [[{name: "action", id: 14}, {name: "wild", id: 19}, {name: "love", ket: 23}],[{name: "fantasy", id: 22}, {name: "science", id: 99}],...]

  // we have translations.length = genres.length, so let's merge these 2 arrays together
  return genres.map((genre, index) => ({
    genre,
    translation: translations[index],
  })) as BannerInfo[];

  // yeah I admit that it's hard to understand my code :)
};

// TV TAB
///////////////////////////////////////////////////////////////

export const getHomeTVs = async (): Promise<HomeFilms> => {
  const endpoints: { [key: string]: string } = {
    Trending: "/trending/tv/day",
    Popular: "/tv/popular",
    "Top Rated": "/tv/top_rated",
    Hot: "/trending/tv/day?page=2",
    "On the air": "/tv/on_the_air",
  };

  const responses = await Promise.all(
    Object.entries(endpoints).map((endpoint) => axios.get(endpoint[1]))
  );

  const data = responses.reduce((final, current, index) => {
    final[Object.entries(endpoints)[index][0]] = current.data.results.map(
      (item: Item) => ({
        ...item,
        media_type: "tv",
      })
    );

    return final;
  }, {} as HomeFilms);

  return data;
};

export const getTVBannerInfo = async (tvs: Item[]): Promise<BannerInfo[]> => {
  const detailRes = await Promise.all(
    tvs.map((tv) => axios.get(`/tv/${tv.id}`))
  );

  const translationRes = await Promise.all(
    tvs.map((tv) => axios.get(`/tv/${tv.id}/translations`))
  );

  const translations = translationRes.map((item: any) =>
    item.data.translations
      .filter((translation: any) =>
        ["en", "sw", "fr", "es", "pt", "de", "it", "ru", "ja", "ko", "zh", "ar", "hi"].includes(translation.iso_639_1)
      )
      .reduce((acc: any, element: any) => {
        if (element.iso_639_1 === "en") {
          return [element, ...acc];
        } else if (element.iso_639_1 === "sw") {
          return [element, ...acc];
        }
        return [...acc, element];
      }, [] as any)
      .map((translation: any) => translation.data.name)
  );

  const genres = detailRes.map((item: any) =>
    item.data.genres.filter((_: any, index: number) => index < 3)
  );

  return genres.map((genre, index) => ({
    genre,
    translation: translations[index],
  })) as BannerInfo[];
};

// GENERAL
///////////////////////////////////////////////////////////////
export const getTrendingNow = async (): Promise<Item[]> => {
  return (await axios.get("/trending/all/day?page=2")).data.results;
};

// Add methods for diverse content
export const getAfricanContent = async (): Promise<Item[]> => {
  try {
    // Fetch African movies and TV shows
    const response = await axios.get(
      `/discover/movie?with_origin_country=NG&with_origin_country=KE&with_origin_country=ZA&with_origin_country=EG&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching African content:", error);
    return [];
  }
};

export const getAsianContent = async (): Promise<Item[]> => {
  try {
    // Fetch Asian movies and TV shows
    const response = await axios.get(
      `/discover/movie?with_origin_country=KR&with_origin_country=JP&with_origin_country=CN&with_origin_country=IN&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Asian content:", error);
    return [];
  }
};

export const getLatinAmericanContent = async (): Promise<Item[]> => {
  try {
    // Fetch Latin American movies and TV shows
    const response = await axios.get(
      `/discover/movie?with_origin_country=MX&with_origin_country=BR&with_origin_country=AR&with_origin_country=CO&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Latin American content:", error);
    return [];
  }
};

export const getMiddleEasternContent = async (): Promise<Item[]> => {
  try {
    // Fetch Middle Eastern movies and TV shows
    const response = await axios.get(
      `/discover/movie?with_origin_country=TR&with_origin_country=EG&with_origin_country=SA&with_origin_country=AE&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Middle Eastern content:", error);
    return [];
  }
};

export const getNollywoodContent = async (): Promise<Item[]> => {
  try {
    // Fetch Nigerian (Nollywood) content
    const response = await axios.get(
      `/discover/movie?with_origin_country=NG&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Nollywood content:", error);
    return [];
  }
};

export const getBollywoodContent = async (): Promise<Item[]> => {
  try {
    // Fetch Indian (Bollywood) content
    const response = await axios.get(
      `/discover/movie?with_origin_country=IN&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Bollywood content:", error);
    return [];
  }
};

export const getKoreanContent = async (): Promise<Item[]> => {
  try {
    // Fetch Korean content
    const response = await axios.get(
      `/discover/movie?with_origin_country=KR&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Korean content:", error);
    return [];
  }
};

export const getJapaneseContent = async (): Promise<Item[]> => {
  try {
    // Fetch Japanese content
    const response = await axios.get(
      `/discover/movie?with_origin_country=JP&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Japanese content:", error);
    return [];
  }
};

export const getChineseContent = async (): Promise<Item[]> => {
  try {
    // Fetch Chinese content
    const response = await axios.get(
      `/discover/movie?with_origin_country=CN&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
    );
    return response.data.results || [];
  } catch (error) {
    console.error("Error fetching Chinese content:", error);
    return [];
  }
};
