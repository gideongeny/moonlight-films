# StreamLux

Free Movies, TV Shows & Live Sports Streaming Platform

## Live demo

Official website: [https://streamlux.vercel.app/](https://streamlux.vercel.app/)

**Note:** The website has been rebranded from Moonlight Films to StreamLux. The project uses Firebase for authentication and data storage, and integrates with multiple APIs for content discovery.

## Content Sources

- **Movies & TV Shows:** The Movie Database (TMDB) API
- **Sports Data:** TheSportsDB API (free tier)
- **Streaming Links:** Multiple embed sources for movies, TV shows, and sports content

## Main technology used

- ReactJS, Typescript, TailwindCSS
- Redux-Toolkit
- React-Query, Axios
- Firebase
- Swiper
- React-AutoAnimate, React-Select, React-Toastify, React-Circular-Progressbar, React-Infinite-Scroll-Component, React-Lazy-Load-Image-Component, React-Icons, React-Router-Dom
- Formik, Yup

## Features

### Core Features
- **Well-designed homepage/detail/watching pages** with modern UI
- **Sort/filter** (query-params based) for movies, TV shows, and sports
- **Search by name** with suggestion keywords, filter result by type
- **Skeleton loading**, infinite scrolling, query-based pagination and smooth animation
- **Authentication** by email/password or Google/Facebook. Fully validated sign-up form
- **Bookmark favourite films**, store recently watched films. Allowing to edit films list: Select All -> Clear
- **Profile page**: allowing to change profile photo, name, email, password, verify, delete account after reauthentication
- **Comment system**: Allowing to give reactions, see who reacts to a comment (sorted and filter out the 3 most popular reactions), reply to a comment, edit, delete, hide, sort by latest/popular and load more comment

### New Features (StreamLux)
- **Live Sports Streaming**: Real-time fixtures and scores from multiple leagues (EPL, La Liga, Bundesliga, Serie A, Ligue 1, Champions League, AFCON, Rugby, UFC, WWE, Athletics, etc.)
- **World Cinema Discovery**: Explore movies and TV shows from Africa, Asia, Latin America, Middle East, and more with beautiful category images
- **Enhanced Content Categories**:
  - 🔥 Most Trending Now
  - 👻 Horror Movies
  - ✊🏿 Must-watch Black Shows & Movies
  - 🆕 Latest Nollywood Movies
  - 🇿🇦 SA Drama, 🇹🇭 Thai Drama, 🇨🇳 C-Drama
  - 🌍 African Cinema & TV Shows (comprehensive collection)
  - 📺 African TV Shows & Series (diverse content from multiple African countries)
  - 🇰🇪 Kenyan TV Shows, 🇳🇬 Nigerian TV Shows
  - And many more curated sections
- **Multiple Streaming Sources**: Access to various embed sources for movies, TV shows, and sports (including SportsLive.run and Streamed.pk)
- **Real-time Sports Updates**: Live scores and upcoming fixtures with auto-refresh from TheSportsDB API
- **Enhanced African Content**: Expanded fetching strategies with multiple pages and search terms for maximum content diversity
- **Responsive Design**: Optimized for mobile, tablet, and desktop
- **Copyright Page**: Comprehensive legal information and terms of use

## Screenshots, Preview

![Screenshot 1](https://i.ibb.co/4WM6xSp/home.png)

![Screenshot 2](https://i.ibb.co/CB0694y/detail.png)

![Screenshot 3](https://i.ibb.co/Vxf85Kh/watch.png)

![Screenshot 4](https://i.ibb.co/B2yQtvZ/explore.png)

![Screenshot 5](https://i.ibb.co/NY0kLHD/bookmark.png)

![Screenshot 6](https://i.ibb.co/P5pzbzf/search.png)

![Screenshot 7](https://i.ibb.co/kqc377t/profile.png)

![Screenshot 8](https://i.ibb.co/HzWYzVB/comment.png)

![Screenshot 9](https://i.ibb.co/5BhLp4x/auth.png)

![Screenshot 10](https://i.ibb.co/fGgp0P0/moonlight.png)

![Screenshot 11](https://i.ibb.co/z6JSPYj/404.png)

![Screenshot 12](https://i.ibb.co/LrYHgCF/mobile.png)

## Project Timeline

- **Original Development**: July 2, 2024 to August 9, 2025
- **Rebranded to StreamLux**: 2025
- **Current Version**: StreamLux v2.0 with enhanced features

## How to clone this project

You have to create an account on the website: https://www.themoviedb.org/ to get the API KEY. You then create a file named ".env" in your root project folder.

In that file, assign the API KEY that you get from the previous step to a variable named REACT_APP_API_KEY (it has to be this specific name).

It looks like this:
REACT_APP_API_KEY = a8a6fa2f944128e971223235bc3cxxxxx

## Tech Stack

- **Frontend Framework**: React 18+ with TypeScript
- **Styling**: TailwindCSS
- **State Management**: Redux Toolkit
- **Data Fetching**: React Query (TanStack Query), Axios
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **UI Components**: Swiper, React-AutoAnimate, React-Select, React-Toastify
- **Routing**: React Router DOM v6
- **Image Optimization**: React-Lazy-Load-Image-Component
- **Form Handling**: Formik, Yup
- **Icons**: React-Icons

## Deployment

This project is deployed on Vercel. The build process uses:
- Node.js 24.x (auto-upgraded from engines requirement)
- npm with `--force --legacy-peer-deps --no-optional` flags
- Create React App build system

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Copyright © 2025 StreamLux. All rights reserved.

See [Copyright Page](/copyright) for more information.

---

### 👉 If you like this project, give it a star ✨ and share 👨🏻‍💻 it to your friends 👈
