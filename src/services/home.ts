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
    const africanCountries = [
      "NG",
      "KE",
      "TZ",
      "UG",
      "ET",
      "RW",
      "ZM",
      "GH",
      "ZA",
      "EG",
    ].join("|");

    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(`/discover/movie`, {
        params: {
          with_origin_country: africanCountries,
          sort_by: "popularity.desc",
          page: 1,
        },
      }),
      axios.get(`/discover/tv`, {
        params: {
          with_origin_country: africanCountries,
          sort_by: "popularity.desc",
          page: 1,
        },
      }),
    ]);

    const movieResults = (movieResponse.data.results || []).filter((i: any) => i.poster_path);
    const tvResults = (tvResponse.data.results || []).filter((i: any) => i.poster_path);

    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));

    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching African content:", error);
    return [];
  }
};

// Separate function for East African content
export const getEastAfricanContent = async (): Promise<Item[]> => {
  try {
    const eastAfricanCountries = ["KE", "TZ", "UG", "ET", "RW", "ZM"].join("|");

    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(`/discover/movie`, {
        params: {
          with_origin_country: eastAfricanCountries,
          sort_by: "popularity.desc",
          page: 1,
        },
      }),
      axios.get(`/discover/tv`, {
        params: {
          with_origin_country: eastAfricanCountries,
          sort_by: "popularity.desc",
          page: 1,
        },
      }),
    ]);

    const movieResults = (movieResponse.data.results || []).filter((i: any) => i.poster_path);
    const tvResults = (tvResponse.data.results || []).filter((i: any) => i.poster_path);

    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));

    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching East African content:", error);
    return [];
  }
};

// Separate function for South African content
export const getSouthAfricanContent = async (): Promise<Item[]> => {
  try {
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=ZA&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=ZA&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching South African content:", error);
    return [];
  }
};

// Kenyan TV Shows - Popular shows from major Kenyan channels
export const getKenyanTVShows = async (): Promise<Item[]> => {
  try {
    const curatedTitles = [
      "Maria",
      "Zora",
      "Sultana",
      "Selina",
      "Kina",
      "Njoro wa Uba",
      "Inspekta Mwala",
      "Tahidi High",
      "Papa Shirandula",
      "Machachari",
      "Mother-in-Law",
      "Varshita",
      "The Real Househelps of Kawangware",
      "Hulla Baloo Estate",
      "Crime and Justice",
      "Pepeta",
      "Single Kiasi",
      "Country Queen"
    ];

    const discoverKeTv = axios.get(`/discover/tv`, {
      params: {
        with_origin_country: "KE",
        sort_by: "popularity.desc",
        page: 1,
      },
    });

    const searchPromises = curatedTitles.map((title) =>
      axios.get(`/search/tv?query=${encodeURIComponent(title)}&page=1`)
    );

    const [discoverResponse, ...searchResponses] = await Promise.all([
      discoverKeTv,
      ...searchPromises,
    ]);

    const discoverResults = (discoverResponse.data.results || []).map((i: any) => ({
      ...i,
      media_type: "tv",
    }));

    const searchedResultsRaw = searchResponses.flatMap((res) => res.data.results || []);

    const curatedNameSet = new Set(curatedTitles.map((t) => t.toLowerCase()));
    const searchedResults = searchedResultsRaw
      .filter((item: any) => {
        const isKenyan = Array.isArray(item.origin_country) && item.origin_country.includes("KE");
        const matchesCurated = curatedNameSet.has((item.name || "").toLowerCase());
        return isKenyan || matchesCurated;
      })
      .map((i: any) => ({ ...i, media_type: "tv" }));

    const combined = [...discoverResults, ...searchedResults];
    const unique = combined.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    return unique;
  } catch (error) {
    console.error("Error fetching Kenyan TV shows:", error);
    return [];
  }
};

// Nigerian TV Shows and Nollywood content
export const getNigerianTVShows = async (): Promise<Item[]> => {
  try {
    const searchTerms = [
      "Nigerian TV series",
      "Nollywood TV",
      "Nigerian drama",
      "Nigerian soap opera",
      "Nigerian comedy",
      "Nigerian reality show",
      "Nigerian news"
    ];
    
    const searchPromises = searchTerms.map(term => 
      axios.get(`/search/tv?query=${encodeURIComponent(term)}&page=1`)
    );
    
    const searchResults = await Promise.all(searchPromises);
    
    const allResults = searchResults.flatMap(response => 
      response.data.results || []
    );
    
    const uniqueResults = allResults
      .filter((item: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.id === item.id)
      )
      .map((item: any) => ({ ...item, media_type: "tv" }));
    
    return uniqueResults;
  } catch (error) {
    console.error("Error fetching Nigerian TV shows:", error);
    return [];
  }
};

export const getAsianContent = async (): Promise<Item[]> => {
  try {
    // Fetch Asian movies and TV shows including Southeast Asia
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=KR&with_origin_country=JP&with_origin_country=CN&with_origin_country=IN&with_origin_country=PH&with_origin_country=TH&with_origin_country=VN&with_origin_country=MY&with_origin_country=SG&with_origin_country=ID&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=KR&with_origin_country=JP&with_origin_country=CN&with_origin_country=IN&with_origin_country=PH&with_origin_country=TH&with_origin_country=VN&with_origin_country=MY&with_origin_country=SG&with_origin_country=ID&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Asian content:", error);
    return [];
  }
};

// Separate function for Southeast Asian content
export const getSoutheastAsianContent = async (): Promise<Item[]> => {
  try {
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=PH&with_origin_country=TH&with_origin_country=VN&with_origin_country=MY&with_origin_country=SG&with_origin_country=ID&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=PH&with_origin_country=TH&with_origin_country=VN&with_origin_country=MY&with_origin_country=SG&with_origin_country=ID&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Southeast Asian content:", error);
    return [];
  }
};

// Separate function for Filipino content
export const getFilipinoContent = async (): Promise<Item[]> => {
  try {
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=PH&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=PH&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Filipino content:", error);
    return [];
  }
};

export const getLatinAmericanContent = async (): Promise<Item[]> => {
  try {
    // Fetch Latin American movies and TV shows including more countries
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=MX&with_origin_country=BR&with_origin_country=AR&with_origin_country=CO&with_origin_country=PE&with_origin_country=CL&with_origin_country=VE&with_origin_country=EC&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=MX&with_origin_country=BR&with_origin_country=AR&with_origin_country=CO&with_origin_country=PE&with_origin_country=CL&with_origin_country=VE&with_origin_country=EC&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Latin American content:", error);
    return [];
  }
};

// Separate function for Brazilian content
export const getBrazilianContent = async (): Promise<Item[]> => {
  try {
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=BR&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=BR&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Brazilian content:", error);
    return [];
  }
};

// Separate function for Mexican content
export const getMexicanContent = async (): Promise<Item[]> => {
  try {
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=MX&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=MX&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Mexican content:", error);
    return [];
  }
};

export const getMiddleEasternContent = async (): Promise<Item[]> => {
  try {
    // Fetch Middle Eastern movies and TV shows
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=TR&with_origin_country=EG&with_origin_country=SA&with_origin_country=AE&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=TR&with_origin_country=EG&with_origin_country=SA&with_origin_country=AE&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Middle Eastern content:", error);
    return [];
  }
};

export const getNollywoodContent = async (): Promise<Item[]> => {
  try {
    // Fetch Nigerian (Nollywood) content with better keywords and include TV shows
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=NG&with_keywords=210024|210025|210026|210027|210028&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=NG&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Nollywood content:", error);
    return [];
  }
};

export const getBollywoodContent = async (): Promise<Item[]> => {
  try {
    // Fetch Indian (Bollywood) content including TV shows
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=IN&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=IN&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Bollywood content:", error);
    return [];
  }
};

export const getKoreanContent = async (): Promise<Item[]> => {
  try {
    // Fetch Korean content including TV shows
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=KR&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=KR&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Korean content:", error);
    return [];
  }
};

export const getJapaneseContent = async (): Promise<Item[]> => {
  try {
    // Fetch Japanese content including TV shows
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=JP&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=JP&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Japanese content:", error);
    return [];
  }
};

export const getChineseContent = async (): Promise<Item[]> => {
  try {
    // Fetch Chinese content including TV shows
    const [movieResponse, tvResponse] = await Promise.all([
      axios.get(
        `/discover/movie?with_origin_country=CN&with_keywords=210024|210025|210026&sort_by=popularity.desc&page=1`
      ),
      axios.get(
        `/discover/tv?with_origin_country=CN&sort_by=popularity.desc&page=1`
      )
    ]);
    
    const movieResults = movieResponse.data.results || [];
    const tvResults = tvResponse.data.results || [];
    
    const movies = movieResults.map((item: any) => ({ ...item, media_type: "movie" }));
    const tvs = tvResults.map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...movies, ...tvs];
  } catch (error) {
    console.error("Error fetching Chinese content:", error);
    return [];
  }
};

// Enhanced African TV content fetching with alternative methods
export const getAfricanTVContent = async (): Promise<Item[]> => {
  try {
    // Since TMDB has limited African TV content, we'll use multiple search strategies
    const searchTerms = [
      // Kenyan TV shows
      "Citizen TV",
      "NTV Kenya", 
      "KTN Kenya",
      "Kenyan TV",
      "Kenyan drama",
      "Kenyan soap",
      "Kenyan comedy",
      // Nigerian TV shows
      "Nigerian TV",
      "Nollywood TV",
      "Nigerian drama",
      "Nigerian soap",
      // South African TV shows
      "South African TV",
      "SABC",
      "eTV",
      "M-Net",
      // Tanzanian TV shows
      "Tanzanian TV",
      "TBC",
      "ITV Tanzania",
      // Ugandan TV shows
      "Ugandan TV",
      "NTV Uganda",
      "UBC",
      // Ghanaian TV shows
      "Ghanaian TV",
      "GTV",
      "TV3 Ghana",
      // Ethiopian TV shows
      "Ethiopian TV",
      "ETV",
      // Rwandan TV shows
      "Rwandan TV",
      "RTV",
      // Zambian TV shows
      "Zambian TV",
      "ZNBC",
      // General African content
      "African TV series",
      "African drama",
      "African soap opera",
      "African comedy",
      "African reality show",
      "African news",
      "African documentary"
    ];
    
    const searchPromises = searchTerms.map(term => 
      axios.get(`/search/tv?query=${encodeURIComponent(term)}&page=1`)
    );
    
    const searchResults = await Promise.all(searchPromises);
    
    // Combine all results and filter for African content
    const allResults = searchResults.flatMap(response => 
      response.data.results || []
    );
    
    // Remove duplicates and ensure media_type is set
    const uniqueResults = allResults
      .filter((item: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.id === item.id)
      )
      .map((item: any) => ({ ...item, media_type: "tv" }));
    
    return uniqueResults;
  } catch (error) {
    console.error("Error fetching African TV content:", error);
    return [];
  }
};

// Enhanced Nollywood content with better search terms
export const getEnhancedNollywoodContent = async (): Promise<Item[]> => {
  try {
    const searchTerms = [
      "Nollywood",
      "Nigerian movie",
      "Nigerian film",
      "Nigerian cinema",
      "Nigerian drama",
      "Nigerian comedy",
      "Nigerian action",
      "Nigerian romance",
      "Nigerian thriller",
      "Nigerian horror",
      "Nigerian family",
      "Nigerian documentary",
      "Lagos movie",
      "Abuja movie",
      "Nigerian TV series",
      "Nigerian soap opera",
      "Nigerian reality show",
      "Nigerian news",
      "Nigerian entertainment"
    ];
    
    const [moviePromises, tvPromises] = await Promise.all([
      searchTerms.map(term => 
        axios.get(`/search/movie?query=${encodeURIComponent(term)}&page=1`)
      ),
      searchTerms.map(term => 
        axios.get(`/search/tv?query=${encodeURIComponent(term)}&page=1`)
      )
    ]);
    
    const movieResults = await Promise.all(moviePromises);
    const tvResults = await Promise.all(tvPromises);
    
    const allMovieResults = movieResults.flatMap(response => 
      response.data.results || []
    );
    const allTVResults = tvResults.flatMap(response => 
      response.data.results || []
    );
    
    // Remove duplicates and set media_type
    const uniqueMovieResults = allMovieResults
      .filter((item: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.id === item.id)
      )
      .map((item: any) => ({ ...item, media_type: "movie" }));
    
    const uniqueTVResults = allTVResults
      .filter((item: any, index: number, self: any[]) => 
        index === self.findIndex((t: any) => t.id === item.id)
      )
      .map((item: any) => ({ ...item, media_type: "tv" }));
    
    return [...uniqueMovieResults, ...uniqueTVResults];
  } catch (error) {
    console.error("Error fetching enhanced Nollywood content:", error);
    return [];
  }
};

// Enhanced Kenyan content with specific channel shows
export const getEnhancedKenyanContent = async (): Promise<Item[]> => {
  try {
    const curatedTvTitles = [
      "Maria",
      "Zora",
      "Sultana",
      "Selina",
      "Kina",
      "Njoro wa Uba",
      "Inspekta Mwala",
      "Tahidi High",
      "Papa Shirandula",
      "Machachari",
      "Mother-in-Law",
      "Varshita",
      "The Real Househelps of Kawangware",
      "Hulla Baloo Estate",
      "Crime and Justice",
      "Pepeta",
      "Single Kiasi",
      "Country Queen"
    ];

    const curatedMovieTitles = [
      "Rafiki",
      "Nairobi Half Life",
      "Kati Kati",
      "Supa Modo",
      "Disconnect",
      "Plan B",
      "18 Hours",
      "Poacher",
      "You Again"
    ];

    const discoverKeMovie = axios.get(`/discover/movie`, {
      params: { with_origin_country: "KE", sort_by: "popularity.desc", page: 1 },
    });
    const discoverKeTv = axios.get(`/discover/tv`, {
      params: { with_origin_country: "KE", sort_by: "popularity.desc", page: 1 },
    });

    const tvSearchPromises = curatedTvTitles.map((t) =>
      axios.get(`/search/tv?query=${encodeURIComponent(t)}&page=1`)
    );
    const movieSearchPromises = curatedMovieTitles.map((t) =>
      axios.get(`/search/movie?query=${encodeURIComponent(t)}&page=1`)
    );

    const [discMovieRes, discTvRes, tvSearchResList, movieSearchResList] = await Promise.all([
      discoverKeMovie,
      discoverKeTv,
      Promise.all(tvSearchPromises),
      Promise.all(movieSearchPromises),
    ]);

    const discMovies = (discMovieRes.data.results || []).map((i: any) => ({ ...i, media_type: "movie" }));
    const discTvs = (discTvRes.data.results || []).map((i: any) => ({ ...i, media_type: "tv" }));

    const tvCuratedSet = new Set(curatedTvTitles.map((t) => t.toLowerCase()));
    const movieCuratedSet = new Set(curatedMovieTitles.map((t) => t.toLowerCase()));

    const searchedTvs = tvSearchResList
      .flatMap((res) => res.data.results || [])
      .filter((item: any) => {
        const isKenyan = Array.isArray(item.origin_country) && item.origin_country.includes("KE");
        const matchesCurated = tvCuratedSet.has((item.name || "").toLowerCase());
        return isKenyan || matchesCurated;
      })
      .map((i: any) => ({ ...i, media_type: "tv" }));

    const searchedMovies = movieSearchResList
      .flatMap((res) => res.data.results || [])
      .filter((item: any) => {
        const matchesCurated = movieCuratedSet.has((item.title || item.original_title || "").toLowerCase());
        return matchesCurated;
      })
      .map((i: any) => ({ ...i, media_type: "movie" }));

    const combined = [...discMovies, ...discTvs, ...searchedTvs, ...searchedMovies];
    const unique = combined.filter(
      (item, index, self) => index === self.findIndex((t) => t.id === item.id)
    );

    return unique;
  } catch (error) {
    console.error("Error fetching enhanced Kenyan content:", error);
    return [];
  }
};
