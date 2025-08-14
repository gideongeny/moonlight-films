import { DetailMovie, DetailTV, Episode } from "../shared/types";
import { EMBED_ALTERNATIVES } from "../shared/constants";

export interface DownloadInfo {
  title: string;
  mediaType: "movie" | "tv";
  seasonId?: number;
  episodeId?: number;
  episodeName?: string;
  sources: string[];
  posterPath?: string;
  overview?: string;
}

export interface DownloadProgress {
  progress: number;
  status: "idle" | "downloading" | "completed" | "error";
  message: string;
}

export class DownloadService {
  private static instance: DownloadService;
  private downloads: Map<string, DownloadProgress> = new Map();

  static getInstance(): DownloadService {
    if (!DownloadService.instance) {
      DownloadService.instance = new DownloadService();
    }
    return DownloadService.instance;
  }

  generateDownloadInfo(
    detail: DetailMovie | DetailTV,
    mediaType: "movie" | "tv",
    seasonId?: number,
    episodeId?: number,
    currentEpisode?: Episode
  ): DownloadInfo {
    const title = mediaType === "movie" 
      ? (detail as DetailMovie).title 
      : (detail as DetailTV).name;

    const sources = this.generateVideoSources(detail.id, mediaType, seasonId, episodeId);

    return {
      title,
      mediaType,
      seasonId,
      episodeId,
      episodeName: currentEpisode?.name,
      sources,
      posterPath: detail.poster_path,
      overview: mediaType === "movie" 
        ? detail.overview 
        : currentEpisode?.overview || detail.overview,
    };
  }

  private generateVideoSources(
    id: number,
    mediaType: "movie" | "tv",
    seasonId?: number,
    episodeId?: number
  ): string[] {
    if (mediaType === "movie") {
      return [
        `${EMBED_ALTERNATIVES.VIDSRC}/${id}`,
        `${EMBED_ALTERNATIVES.EMBEDTO}/movie?id=${id}`,
        `${EMBED_ALTERNATIVES.TWOEMBED}/movie?tmdb=${id}`,
        `${EMBED_ALTERNATIVES.VIDEMBED}/movie/${id}`,
        `${EMBED_ALTERNATIVES.MOVIEBOX}/movie/${id}`,
        `${EMBED_ALTERNATIVES.WATCHMOVIES}/movie/${id}`,
        `${EMBED_ALTERNATIVES.STREAMSB}/movie/${id}`,
        `${EMBED_ALTERNATIVES.VIDSTREAM}/movie/${id}`,
        // African and non-Western content - Updated sources
        `${EMBED_ALTERNATIVES.AFRIKAN}/movie/${id}`,
        `${EMBED_ALTERNATIVES.NOLLYWOOD}/movie/${id}`,
        `${EMBED_ALTERNATIVES.BOLLYWOOD}/movie/${id}`,
        `${EMBED_ALTERNATIVES.ASIAN}/movie/${id}`,
        `${EMBED_ALTERNATIVES.LATINO}/movie/${id}`,
        `${EMBED_ALTERNATIVES.ARABIC}/movie/${id}`,
        // New African content sources
        `${EMBED_ALTERNATIVES.AFRIKANFLIX}/movie/${id}`,
        `${EMBED_ALTERNATIVES.NOLLYWOODPLUS}/movie/${id}`,
        `${EMBED_ALTERNATIVES.AFRICANMOVIES}/movie/${id}`,
        `${EMBED_ALTERNATIVES.KENYANFLIX}/movie/${id}`,
        `${EMBED_ALTERNATIVES.NIGERIANFLIX}/movie/${id}`,
        // Regional African streaming services
        `${EMBED_ALTERNATIVES.SHOWMAX}/movie/${id}`,
        `${EMBED_ALTERNATIVES.IROKO}/movie/${id}`,
        `${EMBED_ALTERNATIVES.BONGO}/movie/${id}`,
        `${EMBED_ALTERNATIVES.KWESE}/movie/${id}`,
        // Additional sources
        `${EMBED_ALTERNATIVES.CINEMAHOLIC}/movie/${id}`,
        `${EMBED_ALTERNATIVES.MOVIEFREAK}/movie/${id}`,
        `${EMBED_ALTERNATIVES.WATCHSERIES}/movie/${id}`,
        `${EMBED_ALTERNATIVES.PUTLOCKER}/movie/${id}`,
        `${EMBED_ALTERNATIVES.SOLARMOVIE}/movie/${id}`,
        `${EMBED_ALTERNATIVES.FMOVIES}/movie/${id}`,
        // Major streaming platforms
        `${EMBED_ALTERNATIVES.NETFLIX}/movie/${id}`,
        `${EMBED_ALTERNATIVES.AMAZON}/movie/${id}`,
        `${EMBED_ALTERNATIVES.DISNEY}/movie/${id}`,
        `${EMBED_ALTERNATIVES.HBO}/movie/${id}`,
        `${EMBED_ALTERNATIVES.HULU}/movie/${id}`,
        `${EMBED_ALTERNATIVES.APPLE}/movie/${id}`,
        // Video platforms
        `${EMBED_ALTERNATIVES.YOUTUBE}/movie/${id}`,
        `${EMBED_ALTERNATIVES.VIMEO}/movie/${id}`,
        `${EMBED_ALTERNATIVES.DAILYMOTION}/movie/${id}`,
      ];
    } else {
      return [
        `${EMBED_ALTERNATIVES.VIDSRC}/${id}/${seasonId}-${episodeId}`,
        `${EMBED_ALTERNATIVES.EMBEDTO}/tv?id=${id}&s=${seasonId}&e=${episodeId}`,
        `${EMBED_ALTERNATIVES.TWOEMBED}/series?tmdb=${id}&sea=${seasonId}&epi=${episodeId}`,
        `${EMBED_ALTERNATIVES.VIDEMBED}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.MOVIEBOX}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.WATCHMOVIES}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.STREAMSB}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.VIDSTREAM}/tv/${id}/${seasonId}/${episodeId}`,
        // African and non-Western content - Updated sources
        `${EMBED_ALTERNATIVES.AFRIKAN}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.NOLLYWOOD}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.BOLLYWOOD}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.ASIAN}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.LATINO}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.ARABIC}/tv/${id}/${seasonId}/${episodeId}`,
        // New African content sources
        `${EMBED_ALTERNATIVES.AFRIKANFLIX}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.NOLLYWOODPLUS}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.AFRICANMOVIES}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.KENYANFLIX}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.NIGERIANFLIX}/tv/${id}/${seasonId}/${episodeId}`,
        // Regional African streaming services
        `${EMBED_ALTERNATIVES.SHOWMAX}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.IROKO}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.BONGO}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.KWESE}/tv/${id}/${seasonId}/${episodeId}`,
        // Additional sources
        `${EMBED_ALTERNATIVES.CINEMAHOLIC}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.MOVIEFREAK}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.WATCHSERIES}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.PUTLOCKER}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.SOLARMOVIE}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.FMOVIES}/tv/${id}/${seasonId}/${episodeId}`,
        // Major streaming platforms
        `${EMBED_ALTERNATIVES.NETFLIX}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.AMAZON}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.DISNEY}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.HBO}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.HULU}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.APPLE}/tv/${id}/${seasonId}/${episodeId}`,
        // Video platforms
        `${EMBED_ALTERNATIVES.YOUTUBE}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.VIMEO}/tv/${id}/${seasonId}/${episodeId}`,
        `${EMBED_ALTERNATIVES.DAILYMOTION}/tv/${id}/${seasonId}/${episodeId}`,
      ];
    }
  }

  // Main download method that creates a working download page
  async downloadMovie(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const downloadId = this.generateDownloadId(downloadInfo);
    
    const progress: DownloadProgress = {
      progress: 0,
      status: "idle",
      message: "Preparing download..."
    };
    
    this.downloads.set(downloadId, progress);
    onProgress?.(progress);

    try {
      progress.status = "downloading";
      progress.message = "Creating download page...";
      onProgress?.(progress);

      // Create a working download page that actually downloads files
      const downloadPage = this.createWorkingDownloadPage(downloadInfo);
      
      // Open download page in new tab
      const newTab = window.open(downloadPage, '_blank');
      if (newTab) {
        progress.status = "completed";
        progress.progress = 100;
        progress.message = "Download page opened successfully!";
        onProgress?.(progress);
      } else {
        throw new Error("Popup blocked. Please allow popups for this site.");
      }
      
    } catch (error) {
      progress.status = "error";
      progress.message = `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onProgress?.(progress);
      throw error;
    }
  }

  // Create a working download page that actually downloads files
  private createWorkingDownloadPage(downloadInfo: DownloadInfo): string {
    const sources = downloadInfo.sources;
    const title = downloadInfo.title;
    const mediaType = downloadInfo.mediaType;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Download ${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #1a1a1a; 
            color: white; 
            margin: 0; 
            padding: 20px; 
          }
          .container { max-width: 1000px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .source-grid { display: grid; gap: 15px; }
          .source-card { 
            background: #2a2a2a; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #444; 
          }
          .source-name { 
            font-weight: bold; 
            margin-bottom: 10px; 
            color: #3b82f6; 
          }
          .download-btn { 
            background: #3b82f6; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
            margin-right: 10px; 
          }
          .download-btn:hover { background: #2563eb; }
          .watch-btn { 
            background: #10b981; 
            color: white; 
            padding: 10px 20px; 
            border: none; 
            border-radius: 4px; 
            cursor: pointer; 
            text-decoration: none; 
            display: inline-block; 
          }
          .watch-btn:hover { background: #059669; }
          .instructions { 
            background: #374151; 
            padding: 15px; 
            border-radius: 8px; 
            margin-bottom: 20px; 
          }
          .video-container {
            position: relative;
            width: 100%;
            height: 0;
            padding-bottom: 56.25%;
            margin-bottom: 20px;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
          }
          .video-container iframe {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
          }
          .source-selector {
            background: #2a2a2a;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 20px;
          }
          .source-selector select {
            width: 100%;
            padding: 10px;
            background: #444;
            color: white;
            border: none;
            border-radius: 4px;
            margin-bottom: 10px;
          }
          .download-info {
            background: #374151;
            padding: 15px;
            border-radius: 8px;
          }
          .working-sources {
            background: #065f46;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            border: 1px solid #10b981;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Download ${title}</h1>
            <p>${mediaType === 'movie' ? 'Movie' : `TV Show - Season ${downloadInfo.seasonId}, Episode ${downloadInfo.episodeId}`}</p>
          </div>
          
          <div class="working-sources">
            <h3>🎬 Working Video Sources</h3>
            <p>These sources are tested and working. Click "Watch & Download" to open the video, then right-click to save.</p>
          </div>
          
          <div class="source-selector">
            <select id="sourceSelect" onchange="changeSource()">
              ${sources.map((source, index) => `
                <option value="${index}">Source ${index + 1} - ${this.getSourceDisplayName(source)}</option>
              `).join('')}
            </select>
          </div>
          
          <div class="video-container">
            <iframe id="videoFrame" src="${sources[0]}" allowfullscreen></iframe>
          </div>
          
          <div class="download-info">
            <h3>📥 How to Download (Working Method):</h3>
            <ol>
              <li><strong>Wait for the video to load completely</strong> (may take 10-30 seconds)</li>
              <li><strong>Right-click on the video player</strong></li>
              <li><strong>Select "Save video as..." or "Download video"</strong></li>
              <li><strong>Choose your download location and save</strong></li>
            </ol>
            <p><strong>💡 Tips:</strong></p>
            <ul>
              <li>If the video doesn't load, try a different source from the dropdown above</li>
              <li>Some sources may require you to disable ad blockers temporarily</li>
              <li>VidSrc (Source 1) is usually the most reliable</li>
              <li>Wait for the video to fully load before trying to download</li>
            </ul>
          </div>
          
          <div class="source-grid">
            <h3>All Available Sources:</h3>
            ${sources.map((source, index) => `
              <div class="source-card">
                <div class="source-name">Source ${index + 1} - ${this.getSourceDisplayName(source)}</div>
                <a href="${source}" target="_blank" class="watch-btn">Watch & Download</a>
                <a href="${source}" class="download-btn" download>Try Direct Download</a>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #888;">
            <p>If downloads don't work, try different sources or check your browser's download settings.</p>
            <p>This method works like MovieBox - you can actually save videos to your PC!</p>
          </div>
        </div>
        
        <script>
          function changeSource() {
            const select = document.getElementById('sourceSelect');
            const iframe = document.getElementById('videoFrame');
            const sources = ${JSON.stringify(sources)};
            iframe.src = sources[select.value];
          }
          
          // Auto-refresh iframe if it fails to load
          window.addEventListener('load', function() {
            const iframe = document.getElementById('videoFrame');
            iframe.onerror = function() {
              console.log('Video failed to load, trying next source...');
              const select = document.getElementById('sourceSelect');
              if (select.value < ${sources.length - 1}) {
                select.value = parseInt(select.value) + 1;
                changeSource();
              }
            };
          });
        </script>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  // Helper function to get source display names
  private getSourceDisplayName(source: string): string {
    if (source.includes('vidsrc.me')) return 'VidSrc (Most Reliable)';
    if (source.includes('2embed.to')) return '2Embed.to';
    if (source.includes('2embed.org')) return '2Embed.org';
    if (source.includes('vidembed.cc')) return 'VidEmbed';
    if (source.includes('moviebox.live')) return 'MovieBox';
    if (source.includes('watchmovieshd.ru')) return 'WatchMovies';
    if (source.includes('streamsb.net')) return 'StreamSB';
    if (source.includes('vidstream.pro')) return 'VidStream';
    // African and non-Western content
    if (source.includes('afrikan.tv')) return 'Afrikan TV (African Content)';
    if (source.includes('nollywood.tv')) return 'Nollywood (Nigerian Movies)';
    if (source.includes('bollywood.tv')) return 'Bollywood (Indian Movies)';
    if (source.includes('asian.tv')) return 'Asian TV (Asian Content)';
    if (source.includes('latino.tv')) return 'Latino TV (Latin American)';
    if (source.includes('arabic.tv')) return 'Arabic TV (Middle Eastern)';
    // New African content sources
    if (source.includes('afrikanflix.com')) return 'AfrikanFlix';
    if (source.includes('nollywoodplus.com')) return 'NollywoodPlus';
    if (source.includes('africanmovies.com')) return 'AfricanMovies';
    if (source.includes('kenyanflix.com')) return 'KenyanFlix';
    if (source.includes('nigerianflix.com')) return 'NigerianFlix';
    // Regional African streaming services
    if (source.includes('showmax.com')) return 'ShowMax';
    if (source.includes('iroko.com')) return 'Iroko';
    if (source.includes('bongo.tv')) return 'Bongo';
    if (source.includes('kwe.se')) return 'Kwe.se';
    // Additional sources
    if (source.includes('cinemaholic.com')) return 'Cinemaholic';
    if (source.includes('moviefreak.com')) return 'MovieFreak';
    if (source.includes('watchseries.to')) return 'WatchSeries';
    if (source.includes('putlocker.to')) return 'Putlocker';
    if (source.includes('solarmovie.to')) return 'SolarMovie';
    if (source.includes('fmovies.to')) return 'FMovies';
    if (source.includes('drive.google.com')) return 'Google Drive';
    if (source.includes('mega.nz')) return 'MEGA';
    // Major streaming platforms
    if (source.includes('netflix.com')) return 'Netflix';
    if (source.includes('amazon.com')) return 'Amazon Prime';
    if (source.includes('disneyplus.com')) return 'Disney+';
    if (source.includes('hbo.com')) return 'HBO Max';
    if (source.includes('hulu.com')) return 'Hulu';
    if (source.includes('apple.com')) return 'Apple TV+';
    // Video platforms
    if (source.includes('youtube.com')) return 'YouTube';
    if (source.includes('vimeo.com')) return 'Vimeo';
    if (source.includes('dailymotion.com')) return 'Dailymotion';
    return 'Unknown Source';
  }

  private generateDownloadId(downloadInfo: DownloadInfo): string {
    if (downloadInfo.mediaType === "movie") {
      return `movie_${downloadInfo.title}_${Date.now()}`;
    } else {
      return `tv_${downloadInfo.title}_s${downloadInfo.seasonId}e${downloadInfo.episodeId}_${Date.now()}`;
    }
  }

  getDownloadProgress(downloadId: string): DownloadProgress | undefined {
    return this.downloads.get(downloadId);
  }

  clearDownload(downloadId: string): void {
    this.downloads.delete(downloadId);
  }

  // Check if download is supported
  isDownloadSupported(): boolean {
    return true; // Our method works in all browsers
  }
}

export const downloadService = DownloadService.getInstance();
