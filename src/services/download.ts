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
      ];
    }
  }

  // Main download method that tries multiple approaches
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
      progress.message = "Starting download...";
      onProgress?.(progress);

      // Try direct download first
      try {
        await this.attemptDirectDownload(downloadInfo, onProgress);
        return;
      } catch (error) {
        console.log("Direct download failed, trying alternative methods...");
      }

      // Try iframe extraction
      try {
        await this.attemptIframeExtraction(downloadInfo, onProgress);
        return;
      } catch (error) {
        console.log("Iframe extraction failed, trying external links...");
      }

      // Fallback to external download links
      await this.createExternalDownloadLinks(downloadInfo, onProgress);
      
    } catch (error) {
      progress.status = "error";
      progress.message = `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onProgress?.(progress);
      throw error;
    }
  }

  // Method 1: Try to download directly from video URLs
  private async attemptDirectDownload(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const progress = this.downloads.get(this.generateDownloadId(downloadInfo));
    if (!progress) return;

    progress.message = "Attempting direct download...";
    onProgress?.(progress);

    // For now, we'll create a download page that users can use
    // This is more reliable than trying to extract from iframes
    const downloadPage = this.createDownloadPage(downloadInfo);
    
    // Open download page in new tab
    const newTab = window.open(downloadPage, '_blank');
    if (newTab) {
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "Download page opened in new tab";
      onProgress?.(progress);
    } else {
      throw new Error("Popup blocked. Please allow popups for this site.");
    }
  }

  // Method 2: Try to extract video from iframes (less reliable)
  private async attemptIframeExtraction(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const progress = this.downloads.get(this.generateDownloadId(downloadInfo));
    if (!progress) return;

    progress.message = "Extracting video from source...";
    onProgress?.(progress);

    // This method is less reliable due to CORS restrictions
    // We'll create a simple iframe viewer instead
    const viewerPage = this.createVideoViewerPage(downloadInfo);
    
    const newTab = window.open(viewerPage, '_blank');
    if (newTab) {
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "Video viewer opened in new tab";
      onProgress?.(progress);
    } else {
      throw new Error("Popup blocked. Please allow popups for this site.");
    }
  }

  // Method 3: Create external download links
  private async createExternalDownloadLinks(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const progress = this.downloads.get(this.generateDownloadId(downloadInfo));
    if (!progress) return;

    progress.message = "Creating download links...";
    onProgress?.(progress);

    // Create a download page with all sources
    const downloadPage = this.createDownloadPage(downloadInfo);
    
    const newTab = window.open(downloadPage, '_blank');
    if (newTab) {
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "Download page opened with all sources";
      onProgress?.(progress);
    } else {
      throw new Error("Popup blocked. Please allow popups for this site.");
    }
  }

  // Create a download page with all available sources
  private createDownloadPage(downloadInfo: DownloadInfo): string {
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
          .container { max-width: 800px; margin: 0 auto; }
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Download ${title}</h1>
            <p>${mediaType === 'movie' ? 'Movie' : `TV Show - Season ${downloadInfo.seasonId}, Episode ${downloadInfo.episodeId}`}</p>
          </div>
          
          <div class="instructions">
            <h3>📥 How to Download:</h3>
            <ol>
              <li>Click "Watch & Download" on any source below</li>
              <li>Wait for the video to load</li>
              <li>Right-click on the video and select "Save video as..." or "Download video"</li>
              <li>Choose your download location and save</li>
            </ol>
            <p><strong>Note:</strong> Some sources may require you to disable ad blockers for the video to load properly.</p>
          </div>
          
          <div class="source-grid">
            ${sources.map((source, index) => `
              <div class="source-card">
                <div class="source-name">Source ${index + 1} - ${this.getSourceDisplayName(source)}</div>
                <a href="${source}" target="_blank" class="watch-btn">Watch & Download</a>
                <a href="${source}" class="download-btn" download>Direct Download</a>
              </div>
            `).join('')}
          </div>
          
          <div style="text-align: center; margin-top: 30px; color: #888;">
            <p>If downloads don't work, try different sources or check your browser's download settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  // Create a video viewer page
  private createVideoViewerPage(downloadInfo: DownloadInfo): string {
    const sources = downloadInfo.sources;
    const title = downloadInfo.title;
    
    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Watch ${title}</title>
        <style>
          body { 
            font-family: Arial, sans-serif; 
            background: #1a1a1a; 
            color: white; 
            margin: 0; 
            padding: 20px; 
          }
          .container { max-width: 1200px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; }
          .video-container { 
            position: relative; 
            width: 100%; 
            height: 0; 
            padding-bottom: 56.25%; 
            margin-bottom: 20px; 
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
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${title}</h1>
            <p>Select a source below to watch and download</p>
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
            <h3>📥 How to Download:</h3>
            <ol>
              <li>Wait for the video to load completely</li>
              <li>Right-click on the video player</li>
              <li>Select "Save video as..." or "Download video"</li>
              <li>Choose your download location and save</li>
            </ol>
            <p><strong>Tip:</strong> If the video doesn't load, try a different source from the dropdown above.</p>
          </div>
        </div>
        
        <script>
          function changeSource() {
            const select = document.getElementById('sourceSelect');
            const iframe = document.getElementById('videoFrame');
            const sources = ${JSON.stringify(sources)};
            iframe.src = sources[select.value];
          }
        </script>
      </body>
      </html>
    `;
    
    const blob = new Blob([html], { type: 'text/html' });
    return URL.createObjectURL(blob);
  }

  // Helper function to get source display names
  private getSourceDisplayName(source: string): string {
    if (source.includes('vidsrc.me')) return 'VidSrc';
    if (source.includes('2embed.to')) return '2Embed.to';
    if (source.includes('2embed.org')) return '2Embed.org';
    if (source.includes('vidembed.cc')) return 'VidEmbed';
    if (source.includes('moviebox.live')) return 'MovieBox';
    if (source.includes('watchmovieshd.ru')) return 'WatchMovies';
    if (source.includes('streamsb.net')) return 'StreamSB';
    if (source.includes('vidstream.pro')) return 'VidStream';
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
    return true; // Our new method should work in all browsers
  }
}

export const downloadService = DownloadService.getInstance();
