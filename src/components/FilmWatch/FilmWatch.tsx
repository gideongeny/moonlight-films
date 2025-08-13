import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { FunctionComponent, useEffect, useState } from "react";
import { AiFillStar, AiTwotoneCalendar, AiOutlineDownload } from "react-icons/ai";
import { BsThreeDotsVertical } from "react-icons/bs";
import { GiHamburgerMenu } from "react-icons/gi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";
import { useCurrentViewportView } from "../../hooks/useCurrentViewportView";
import { db } from "../../shared/firebase";
import {
  DetailMovie,
  DetailTV,
  Episode,
  getWatchReturnedType,
  Item,
} from "../../shared/types";
import { embedMovie, embedTV } from "../../shared/utils";
import { EMBED_ALTERNATIVES } from "../../shared/constants";
import { useAppSelector } from "../../store/hooks";
import { downloadService } from "../../services/download";
import ReadMore from "../Common/ReadMore";
import RightbarFilms from "../Common/RightbarFilms";
import SearchBox from "../Common/SearchBox";
import Sidebar from "../Common/Sidebar";
import SidebarMini from "../Common/SidebarMini";
import Skeleton from "../Common/Skeleton";
import Title from "../Common/Title";
import Footer from "../Footer/Footer";
import Comment from "./Comment/Comment";
import SeasonSelection from "./SeasonSelection";
import DownloadOptions from "../Common/DownloadOptions";

interface FilmWatchProps {
  media_type: "movie" | "tv";
  seasonId?: number;
  episodeId?: number;
  currentEpisode?: Episode;
}

const FilmWatch: FunctionComponent<FilmWatchProps & getWatchReturnedType> = ({
  detail,
  recommendations,
  detailSeasons,
  media_type,
  seasonId,
  episodeId,
  currentEpisode,
}) => {
  const currentUser = useAppSelector((state) => state.auth.user);
  const { isMobile } = useCurrentViewportView();
  const [isSidebarActive, setIsSidebarActive] = useState(false);
  const [currentSourceIndex, setCurrentSourceIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isLoadingVideo, setIsLoadingVideo] = useState(true);
  const [downloadInfo, setDownloadInfo] = useState<any>(null);

  // Generate all available video sources
  const getVideoSources = () => {
    if (media_type === "movie") {
      return [
        `${EMBED_ALTERNATIVES.VIDSRC}/${detail?.id}`,
        `${EMBED_ALTERNATIVES.EMBEDTO}/movie?id=${detail?.id}`,
        `${EMBED_ALTERNATIVES.TWOEMBED}/movie?tmdb=${detail?.id}`,
        `${EMBED_ALTERNATIVES.VIDEMBED}/movie/${detail?.id}`,
        `${EMBED_ALTERNATIVES.MOVIEBOX}/movie/${detail?.id}`,
        `${EMBED_ALTERNATIVES.WATCHMOVIES}/movie/${detail?.id}`,
        `${EMBED_ALTERNATIVES.STREAMSB}/movie/${detail?.id}`,
        `${EMBED_ALTERNATIVES.VIDSTREAM}/movie/${detail?.id}`,
      ];
    } else {
      return [
        `${EMBED_ALTERNATIVES.VIDSRC}/${detail?.id}/${seasonId}-${episodeId}`,
        `${EMBED_ALTERNATIVES.EMBEDTO}/tv?id=${detail?.id}&s=${seasonId}&e=${episodeId}`,
        `${EMBED_ALTERNATIVES.TWOEMBED}/series?tmdb=${detail?.id}&sea=${seasonId}&epi=${episodeId}`,
        `${EMBED_ALTERNATIVES.VIDEMBED}/tv/${detail?.id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.MOVIEBOX}/tv/${detail?.id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.WATCHMOVIES}/tv/${detail?.id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.STREAMSB}/tv/${detail?.id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.VIDSTREAM}/tv/${detail?.id}/${seasonId}/${episodeId}`,
      ];
    }
  };

  const videoSources = getVideoSources();
  const currentSource = videoSources[currentSourceIndex];

  // Helper function to get readable source names
  const getSourceDisplayName = (source: string): string => {
    if (source.includes('vidsrc.me')) return 'VidSrc';
    if (source.includes('2embed.to')) return '2Embed.to';
    if (source.includes('2embed.org')) return '2Embed.org';
    if (source.includes('vidembed.cc')) return 'VidEmbed';
    if (source.includes('moviebox.live')) return 'MovieBox';
    if (source.includes('watchmovieshd.ru')) return 'WatchMovies';
    if (source.includes('streamsb.net')) return 'StreamSB';
    if (source.includes('vidstream.pro')) return 'VidStream';
    return 'Unknown Source';
  };

  const handleVideoError = () => {
    console.log(`Video source ${currentSourceIndex + 1} failed, trying next...`);
    setVideoError(true);
    
    // Try next source if available
    if (currentSourceIndex < videoSources.length - 1) {
      setTimeout(() => {
        setCurrentSourceIndex(currentSourceIndex + 1);
        setVideoError(false);
        setIsLoadingVideo(true);
      }, 1000);
    } else {
      // All sources failed
      setVideoError(true);
      setIsLoadingVideo(false);
    }
  };

  const handleVideoLoad = () => {
    setIsLoadingVideo(false);
    setVideoError(false);
  };

  // Function to reset to first source
  const resetToFirstSource = () => {
    setCurrentSourceIndex(0);
    setVideoError(false);
    setIsLoadingVideo(true);
  };

  // Auto-advance to next source if current one fails
  useEffect(() => {
    if (videoError && currentSourceIndex < videoSources.length - 1) {
      const timer = setTimeout(() => {
        setCurrentSourceIndex(currentSourceIndex + 1);
        setVideoError(false);
        setIsLoadingVideo(true);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [videoError, currentSourceIndex, videoSources.length]);

  // Reset source when detail changes
  useEffect(() => {
    setCurrentSourceIndex(0);
    setVideoError(false);
    setIsLoadingVideo(true);
  }, [detail?.id, seasonId, episodeId]);

  // Generate download info when detail changes
  useEffect(() => {
    if (detail) {
      const info = downloadService.generateDownloadInfo(
        detail,
        media_type,
        seasonId,
        episodeId,
        currentEpisode
      );
      setDownloadInfo(info);
    }
  }, [detail, media_type, seasonId, episodeId, currentEpisode]);

  useEffect(() => {
    if (!currentUser) return;
    if (!detail) return; // prevent this code from storing undefined value to Firestore (which cause error)

    getDoc(doc(db, "users", currentUser.uid)).then((docSnap) => {
      const isAlreadyStored = docSnap
        .data()
        ?.recentlyWatch.some((film: Item) => film.id === detail?.id);

      if (!isAlreadyStored) {
        updateDoc(doc(db, "users", currentUser.uid), {
          recentlyWatch: arrayUnion({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: media_type,
            ...(media_type === "movie" && {
              title: (detail as DetailMovie)?.title,
            }),
            ...(media_type === "tv" && { name: (detail as DetailTV)?.name }),
          }),
        });
      } else {
        const updatedRecentlyWatch = docSnap
          .data()
          ?.recentlyWatch.filter((film: Item) => film.id !== detail?.id)
          .concat({
            poster_path: detail?.poster_path,
            id: detail?.id,
            vote_average: detail?.vote_average,
            media_type: media_type,
            ...(media_type === "movie" && {
              title: (detail as DetailMovie)?.title,
            }),
            ...(media_type === "tv" && { name: (detail as DetailTV)?.name }),
          });

        updateDoc(doc(db, "users", currentUser.uid), {
          recentlyWatch: updatedRecentlyWatch,
        });
      }
    });
  }, [currentUser, detail, media_type]);

  return (
    <>
      {detail && (
        <Title
          value={`Watch: ${
            (detail as DetailMovie).title || (detail as DetailTV).name
          } ${
            media_type === "tv" ? `- Season ${seasonId} - Ep ${episodeId}` : ""
          } | Moonlight`}
        />
      )}

      <div className="flex md:hidden justify-between items-center px-5 my-5">
        <Link to="/" className="flex gap-2 items-center">
          <LazyLoadImage
            src="/logo.png"
            className="h-10 w-10 rounded-full object-cover"
          />
          <p className="text-xl text-white font-medium tracking-wider uppercase">
            Moon<span className="text-primary">light</span>
          </p>
        </Link>
        <button onClick={() => setIsSidebarActive((prev) => !prev)}>
          <GiHamburgerMenu size={25} />
        </button>
      </div>

      <div className="flex flex-col md:flex-row">
        {!isMobile && <SidebarMini />}
        {isMobile && (
          <Sidebar
            onCloseSidebar={() => setIsSidebarActive(false)}
            isSidebarActive={isSidebarActive}
          />
        )}

        <div className="flex-grow px-[2vw] md:pt-11 pt-0">
          <div className="relative h-0 pb-[56.25%]">
            {!detail && (
              <Skeleton className="absolute top-0 left-0 w-full h-full rounded-sm" />
            )}
            {detail && (
              <>
                {/* Manual source selector */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                  <select
                    value={currentSourceIndex}
                    onChange={(e) => {
                      setCurrentSourceIndex(Number(e.target.value));
                      setVideoError(false);
                      setIsLoadingVideo(true);
                    }}
                    className="bg-black/80 text-white text-xs px-3 py-2 rounded border border-gray-600 hover:border-gray-400 transition-colors"
                  >
                    {videoSources.map((source, index) => (
                      <option key={index} value={index}>
                        {getSourceDisplayName(source)} - Source {index + 1}
                      </option>
                    ))}
                  </select>
                  
                  {/* Download Button */}
                  {downloadInfo && (
                    <button
                      onClick={() => {
                        // Scroll to download section
                        const downloadSection = document.getElementById('download-section');
                        if (downloadSection) {
                          downloadSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="bg-black/80 border border-primary text-primary hover:bg-primary hover:text-white text-xs px-3 py-2 rounded transition-colors flex items-center gap-1"
                    >
                      <AiOutlineDownload size={14} />
                      Download
                    </button>
                  )}
                </div>
                
                <iframe
                  className="absolute w-full h-full top-0 left-0"
                  src={currentSource}
                  title="Film Video Player"
                  frameBorder="0"
                  allowFullScreen
                  onError={handleVideoError}
                  onLoad={handleVideoLoad}
                ></iframe>
                {/* Enhanced video status and fallback controls */}
                <div className="absolute top-4 left-4 bg-black/80 text-white px-4 py-3 rounded-lg text-sm max-w-md">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Video Source {currentSourceIndex + 1}/{videoSources.length}</p>
                    {videoError && (
                      <button
                        onClick={resetToFirstSource}
                        className="text-primary hover:text-blue-300 text-xs underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-xs mb-2 break-all">
                    {currentSource}
                  </p>
                  {isLoadingVideo && (
                    <div className="flex items-center gap-2 text-yellow-400">
                      <div className="w-3 h-3 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-xs">Loading...</span>
                    </div>
                  )}
                  {videoError && currentSourceIndex < videoSources.length - 1 && (
                    <div className="flex items-center gap-2 text-orange-400">
                      <span className="text-xs">Source failed, trying next...</span>
                    </div>
                  )}
                  {videoError && currentSourceIndex === videoSources.length - 1 && (
                    <div className="text-red-400 text-xs">
                      All sources failed. Try refreshing or check your ad blocker.
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="mt-5 pb-8">
            <div className="flex justify-between md:text-base text-sm">
              <div className="flex-1">
                {!detail && <Skeleton className="h-8 w-[400px]" />}
                {detail && (
                  <h1 className="text-white md:text-3xl text-xl font-medium">
                    <Link
                      to={
                        media_type === "movie"
                          ? `/movie/${detail.id}`
                          : `/tv/${detail.id}`
                      }
                      className="hover:brightness-75 transition duration-300"
                    >
                      {(detail as DetailMovie).title ||
                        (detail as DetailTV).name}
                    </Link>
                  </h1>
                )}
                {!detail && <Skeleton className="w-[100px] h-[23px] mt-5" />}
                {detail && (
                  <div className="flex gap-5 mt-5">
                    <div className="flex gap-2 items-center">
                      <AiFillStar size={25} className="text-primary" />
                      {media_type === "movie" && (
                        <p>{detail.vote_average.toFixed(1)}</p>
                      )}
                      {media_type === "tv" && (
                        <p>{currentEpisode?.vote_average.toFixed(1)}</p>
                      )}
                    </div>
                    <div className="flex gap-2 items-center">
                      <AiTwotoneCalendar size={25} className="text-primary" />
                      <p>
                        {media_type === "movie" &&
                          new Date(
                            (detail as DetailMovie).release_date
                          ).getFullYear()}
                        {media_type === "tv" &&
                          new Date(
                            (currentEpisode as Episode).air_date
                          ).getFullYear()}
                      </p>
                    </div>
                  </div>
                )}
                {!detail && <Skeleton className="w-[100px] h-[23px] mt-2" />}
                {!isMobile && detail && (
                  <ul className="flex gap-2 flex-wrap mt-3">
                    {detail.genres.map((genre) => (
                      <li key={genre.id} className="mb-2">
                        <Link
                          to={`/explore?genre=${genre.id}`}
                          className="px-3 py-1 bg-dark-lighten rounded-full hover:brightness-75 duration-300 transition"
                        >
                          {genre.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {media_type === "tv" && currentEpisode && (
                <div className="flex-1">
                  <h2 className="md:text-xl italic uppercase text-gray-200 mt-2 text-right">
                    {currentEpisode.name}
                  </h2>
                  <p className="text-right md:text-lg mt-2">
                    Season {seasonId} &#8212; Episode {episodeId}
                  </p>
                </div>
              )}
            </div>

            {isMobile && detail && (
              <ul className="flex gap-2 flex-wrap mt-3">
                {detail.genres.map((genre) => (
                  <li key={genre.id} className="mb-2">
                    <Link
                      to={`/explore?genre=${genre.id}`}
                      className="px-3 py-1 bg-dark-lighten rounded-full hover:brightness-75 duration-300 transition"
                    >
                      {genre.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}

            <div className="md:text-xl text-lg font-medium text-white mt-5">
              Overview:
            </div>
            {!detail && <Skeleton className="h-[84px] mt-2" />}
            {detail && (
              <ReadMore
                limitTextLength={300}
                className="md:text-lg text-base mt-1"
              >
                {media_type === "movie"
                  ? detail.overview
                  : currentEpisode?.overview}
              </ReadMore>
            )}
            
            {/* Download Section */}
            {downloadInfo && (
              <div id="download-section" className="mt-6">
                <DownloadOptions downloadInfo={downloadInfo} />
              </div>
            )}
          </div>
          <Comment media_type={media_type} id={detail?.id} />
        </div>

        <div className="shrink-0 md:max-w-[400px] w-full relative px-6">
          {!isMobile && <SearchBox />}
          {media_type === "movie" && (
            <RightbarFilms
              name="Recommendations"
              films={recommendations?.filter((item) => item.id !== detail?.id)}
              limitNumber={4}
              isLoading={!recommendations}
              className="md:mt-24"
            />
          )}
          {media_type === "tv" && (
            <div className="md:mt-24">
              <p className="mb-6 text-xl font-medium flex justify-between items-center">
                <span className="text-white">Seasons:</span>
                <BsThreeDotsVertical size={20} />
              </p>
              <SeasonSelection
                detailSeasons={detailSeasons}
                seasonId={seasonId}
                episodeId={episodeId}
              />
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FilmWatch;
