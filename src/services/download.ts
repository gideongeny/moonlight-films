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

  // Main download method that attempts direct file download
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

      // Try to extract and download from each source
      for (let i = 0; i < downloadInfo.sources.length; i++) {
        const source = downloadInfo.sources[i];
        progress.message = `Trying source ${i + 1}/${downloadInfo.sources.length}...`;
        progress.progress = (i / downloadInfo.sources.length) * 25;
        onProgress?.(progress);

        try {
          // Try to extract video URL from the source
          const videoUrl = await this.extractVideoUrl(source);
          if (videoUrl) {
            progress.message = "Video URL found, starting download...";
            progress.progress = 50;
            onProgress?.(progress);
            
            // Download the video file directly
            await this.downloadVideoFile(videoUrl, downloadInfo, onProgress);
            return;
          }
        } catch (error) {
          console.warn(`Source ${i + 1} failed:`, error);
          if (i === downloadInfo.sources.length - 1) {
            throw new Error("All sources failed to provide downloadable content");
          }
        }
      }
      
      // If all sources failed, fall back to external download method
      progress.message = "Direct download failed, opening external download...";
      onProgress?.(progress);
      
      await this.openExternalDownload(downloadInfo, onProgress);
      
    } catch (error) {
      progress.status = "error";
      progress.message = `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onProgress?.(progress);
      throw error;
    }
  }

  // Extract video URL from embedded source
  private async extractVideoUrl(sourceUrl: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      // Create a hidden iframe to access the video content
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = sourceUrl;
      
      const timeout = setTimeout(() => {
        document.body.removeChild(iframe);
        reject(new Error('Source timeout'));
      }, 15000); // 15 second timeout
      
      iframe.onload = () => {
        try {
          // Try to access iframe content
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) {
            clearTimeout(timeout);
            document.body.removeChild(iframe);
            reject(new Error("Cannot access iframe content"));
            return;
          }

          // Look for video elements
          const videoElements = iframeDoc.querySelectorAll('video');
          if (videoElements.length > 0) {
            const videoElement = videoElements[0];
            const videoSrc = videoElement.src || videoElement.currentSrc;
            
            if (videoSrc && this.isValidVideoUrl(videoSrc)) {
              clearTimeout(timeout);
              document.body.removeChild(iframe);
              resolve(videoSrc);
              return;
            }
          }
          
          // Look for video sources in script tags
          const scripts = Array.from(iframeDoc.querySelectorAll('script'));
          for (const script of scripts) {
            const content = script.textContent || script.innerHTML;
            const videoUrlMatch = content.match(/https?:\/\/[^"'\s]+\.(?:mp4|m3u8|webm|avi|mkv)[^"'\s]*/i);
            if (videoUrlMatch && this.isValidVideoUrl(videoUrlMatch[0])) {
              clearTimeout(timeout);
              document.body.removeChild(iframe);
              resolve(videoUrlMatch[0]);
              return;
            }
          }
          
          // Look for video URLs in other elements
          const allElements = Array.from(iframeDoc.querySelectorAll('*'));
          for (const element of allElements) {
            const attributes = ['src', 'data-src', 'data-url', 'href'];
            for (const attr of attributes) {
              const value = element.getAttribute(attr);
              if (value && this.isValidVideoUrl(value)) {
                clearTimeout(timeout);
                document.body.removeChild(iframe);
                resolve(value);
                return;
              }
            }
          }
          
          clearTimeout(timeout);
          document.body.removeChild(iframe);
          resolve(null);
          
        } catch (error) {
          clearTimeout(timeout);
          document.body.removeChild(iframe);
          reject(error);
        }
      };

      iframe.onerror = () => {
        clearTimeout(timeout);
        document.body.removeChild(iframe);
        reject(new Error("Failed to load iframe"));
      };

      document.body.appendChild(iframe);
    });
  }

  // Validate if URL is a valid video URL
  private isValidVideoUrl(url: string): boolean {
    const videoExtensions = ['.mp4', '.m3u8', '.webm', '.avi', '.mkv', '.mov', '.flv'];
    const videoPatterns = [
      /\.(mp4|m3u8|webm|avi|mkv|mov|flv)(\?|$)/i,
      /\/video\//i,
      /\/stream\//i,
      /\/media\//i
    ];
    
    return videoExtensions.some(ext => url.toLowerCase().includes(ext)) ||
           videoPatterns.some(pattern => pattern.test(url));
  }

  // Download video file directly to local storage
  private async downloadVideoFile(
    videoUrl: string,
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const downloadId = this.generateDownloadId(downloadInfo);
      const progress = this.downloads.get(downloadId);
      
      if (!progress) {
        reject(new Error("Download progress not found"));
        return;
      }

      // Try multiple download methods
      this.tryFetchDownload(videoUrl, downloadInfo, progress, onProgress)
        .then(resolve)
        .catch(() => {
          // Fall back to XMLHttpRequest
          this.tryXHRDownload(videoUrl, downloadInfo, progress, onProgress)
            .then(resolve)
            .catch(() => {
              // Final fallback to creating download link
              this.createDownloadLink(videoUrl, downloadInfo, progress, onProgress)
                .then(resolve)
                .catch(reject);
            });
        });
    });
  }

  // Method 1: Try fetch API download
  private async tryFetchDownload(
    videoUrl: string,
    downloadInfo: DownloadInfo,
    progress: DownloadProgress,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    try {
      progress.message = "Downloading with fetch API...";
      progress.progress = 60;
      onProgress?.(progress);

      const response = await fetch(videoUrl);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const contentLength = response.headers.get('content-length');
      const total = contentLength ? parseInt(contentLength, 10) : 0;
      let loaded = 0;

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const chunks: Uint8Array[] = [];
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        chunks.push(value);
        loaded += value.length;
        
        if (total > 0) {
          progress.progress = 60 + (loaded / total) * 30;
          progress.message = `Downloading: ${Math.round((loaded / total) * 100)}%`;
          onProgress?.(progress);
        }
      }

      const blob = new Blob(chunks);
      this.saveFile(blob, downloadInfo);
      
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "Download completed successfully!";
      onProgress?.(progress);
      
    } catch (error) {
      throw error;
    }
  }

  // Method 2: Try XMLHttpRequest download
  private async tryXHRDownload(
    videoUrl: string,
    downloadInfo: DownloadInfo,
    progress: DownloadProgress,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      progress.message = "Downloading with XMLHttpRequest...";
      progress.progress = 60;
      onProgress?.(progress);

      const xhr = new XMLHttpRequest();
      xhr.open('GET', videoUrl, true);
      xhr.responseType = 'blob';
      
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          progress.progress = 60 + (percent * 0.3);
          progress.message = `Downloading: ${Math.round(percent)}%`;
          onProgress?.(progress);
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          this.saveFile(blob, downloadInfo);
          
          progress.status = "completed";
          progress.progress = 100;
          progress.message = "Download completed successfully!";
          onProgress?.(progress);
          resolve();
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => reject(new Error('Network error occurred'));
      xhr.send();
    });
  }

  // Method 3: Create download link (fallback)
  private async createDownloadLink(
    videoUrl: string,
    downloadInfo: DownloadInfo,
    progress: DownloadProgress,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    progress.message = "Creating download link...";
    progress.progress = 90;
    onProgress?.(progress);

    // Create a download link
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = this.generateFileName(downloadInfo);
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    
    // Style the link to make it visible
    a.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #3b82f6;
      color: white;
      padding: 15px 25px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    a.textContent = `Download ${downloadInfo.title}`;
    
    document.body.appendChild(a);
    
    // Auto-click the link
    a.click();
    
    // Remove the link after a delay
    setTimeout(() => {
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    }, 5000);
    
    progress.status = "completed";
    progress.progress = 100;
    progress.message = "Download link created!";
    onProgress?.(progress);
  }

  // Save file to local storage
  private saveFile(blob: Blob, downloadInfo: DownloadInfo): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.generateFileName(downloadInfo);
    
    // Trigger download
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    // Clean up
    window.URL.revokeObjectURL(url);
  }

  // Generate filename for download
  private generateFileName(downloadInfo: DownloadInfo): string {
    const sanitizedTitle = downloadInfo.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    if (downloadInfo.mediaType === "movie") {
      return `${sanitizedTitle}.mp4`;
    } else {
      const episodeName = downloadInfo.episodeName 
        ? downloadInfo.episodeName.replace(/[^a-z0-9]/gi, '_').toLowerCase()
        : `episode_${downloadInfo.episodeId}`;
      return `${sanitizedTitle}_s${downloadInfo.seasonId}e${downloadInfo.episodeId}_${episodeName}.mp4`;
    }
  }

  // Open external download as fallback
  private async openExternalDownload(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const progress = this.downloads.get(this.generateDownloadId(downloadInfo));
    if (!progress) return;

    progress.message = "Opening external download...";
    progress.progress = 95;
    onProgress?.(progress);

    // Create a download page with all sources
    const downloadPage = this.createDownloadPage(downloadInfo);
    
    const newTab = window.open(downloadPage, '_blank');
    if (newTab) {
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "External download page opened";
      onProgress?.(progress);
    } else {
      throw new Error("Popup blocked. Please allow popups for this site.");
    }
  }

  // Create download page with instructions
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
    return 'download' in document.createElement('a') && 
           'createObjectURL' in window.URL &&
           'revokeObjectURL' in window.URL;
  }
}

export const downloadService = DownloadService.getInstance();
