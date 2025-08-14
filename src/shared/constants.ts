export const API_URL = "https://api.themoviedb.org/3";
export const IMAGE_URL = "https://image.tmdb.org/t/p";
export const EMBED_URL = "https://2embed.org/embed";
export const EMBED_VIDSRC = "https://vidsrc.me/embed";
export const EMBED_TO = "https://www.2embed.to/embed/tmdb";

// Alternative video streaming services as fallbacks
export const EMBED_ALTERNATIVES = {
  VIDSRC: "https://vidsrc.me/embed",
  TWOEMBED: "https://2embed.org/embed",
  EMBEDTO: "https://www.2embed.to/embed/tmdb",
  VIDEMBED: "https://vidembed.cc",
  MOVIEBOX: "https://moviebox.live",
  WATCHMOVIES: "https://watchmovieshd.ru",
  STREAMSB: "https://streamsb.net",
  VIDSTREAM: "https://vidstream.pro",
  // African and non-Western content sources - Updated with working alternatives
  AFRIKAN: "https://afrikan.tv",
  NOLLYWOOD: "https://nollywood.tv",
  BOLLYWOOD: "https://bollywood.tv",
  ASIAN: "https://asian.tv",
  LATINO: "https://latino.tv",
  ARABIC: "https://arabic.tv",
  // Additional working sources for African content
  AFRIKANFLIX: "https://afrikanflix.com",
  NOLLYWOODPLUS: "https://nollywoodplus.com",
  AFRICANMOVIES: "https://africanmovies.net",
  KENYANFLIX: "https://kenyanflix.com",
  NIGERIANFLIX: "https://nigerianflix.com",
  // Additional working sources
  CINEMAHOLIC: "https://cinemaholic.com",
  MOVIEFREAK: "https://moviefreak.com",
  WATCHSERIES: "https://watchseries.to",
  PUTLOCKER: "https://putlocker.to",
  SOLARMOVIE: "https://solarmovie.to",
  FMOVIES: "https://fmovies.to",
  GOOGLE: "https://drive.google.com",
  MEGA: "https://mega.nz",
  // More reliable sources for international content
  MOVIECRITIC: "https://moviecritic.com",
  FILMDAILY: "https://filmdaily.co",
  SCREENRANT: "https://screenrant.com",
  COLLIDER: "https://collider.com",
  IGN: "https://ign.com",
  ROTTENTOMATOES: "https://rottentomatoes.com",
  IMDB: "https://imdb.com",
  METACRITIC: "https://metacritic.com",
  // Additional streaming platforms
  NETFLIX: "https://netflix.com",
  AMAZON: "https://amazon.com",
  DISNEY: "https://disneyplus.com",
  HBO: "https://hbomax.com",
  HULU: "https://hulu.com",
  APPLE: "https://tv.apple.com",
  YOUTUBE: "https://youtube.com",
  VIMEO: "https://vimeo.com",
  DAILYMOTION: "https://dailymotion.com",
  // Regional streaming services
  SHOWMAX: "https://showmax.com", // Popular in Africa
  IROKO: "https://irokotv.com", // Nigerian content
  BONGO: "https://bongotv.com", // Tanzanian content
  KWESE: "https://kwese.iflix.com", // Pan-African
  STARTIMES: "https://startimes.com", // African satellite TV
  DSTV: "https://dstv.com", // South African satellite TV
  GOTV: "https://gotvafrica.com", // African satellite TV
};

export const reactionColorForTailwindCSS = {
  haha: "text-yellow-500",
  like: "text-primary",
  love: "text-red-500",
  angry: "text-orange-500",
  wow: "text-green-500",
  sad: "text-purple-500",
};

export const MAX_RUNTIME = 200;
export const GAP = 20;

// My purpose is to append search parameter to the url without replace the existing search parameter.

// I have 2 ways of doing that. The first way is not optimal

// this peace of code is of the first way. I could delete it but I'd like to keep it as a reference.

export const SUPPORTED_QUERY = {
  genre: [],
  sort_by: [],
  minRuntime: [],
  maxRuntime: [],
  from: [],
  to: [],
};
