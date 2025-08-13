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
        `${EMBED_ALTERNATIVES.SUPEREMBED}/movie?tmdb=${id}`,
        `${EMBED_ALTERNATIVES.VEMBED}/movie?tmdb=${id}`,
        `${EMBED_ALTERNATIVES.SMASHYST}/movie?tmdb=${id}`,
      ];
    } else {
      return [
        `${EMBED_ALTERNATIVES.VIDSRC}/${id}/${seasonId}-${episodeId}`,
        `${EMBED_ALTERNATIVES.EMBEDTO}/tv?id=${id}&s=${seasonId}&e=${episodeId}`,
        `${EMBED_ALTERNATIVES.TWOEMBED}/series?tmdb=${id}&sea=${seasonId}&epi=${episodeId}`,
        `${EMBED_ALTERNATIVES.SUPEREMBED}/tv?tmdb=${id}&season=${seasonId}&episode=${episodeId}`,
        `${EMBED_ALTERNATIVES.VEMBED}/tv?tmdb=${id}&season=${seasonId}&episode=${episodeId}`,
        `${EMBED_ALTERNATIVES.SMASHYST}/tv?tmdb=${id}&season=${seasonId}&episode=${episodeId}`,
      ];
    }
  }

  async downloadMovie(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const downloadId = this.generateDownloadId(downloadInfo);
    
    // Initialize download progress
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

      // Try to download from each source until one works
      for (let i = 0; i < downloadInfo.sources.length; i++) {
        const source = downloadInfo.sources[i];
        progress.message = `Trying source ${i + 1}/${downloadInfo.sources.length}...`;
        progress.progress = (i / downloadInfo.sources.length) * 100;
        onProgress?.(progress);

        try {
          await this.attemptDownload(source, downloadInfo, onProgress);
          progress.status = "completed";
          progress.progress = 100;
          progress.message = "Download completed successfully!";
          onProgress?.(progress);
          return;
        } catch (error) {
          console.warn(`Source ${i + 1} failed:`, error);
          if (i === downloadInfo.sources.length - 1) {
            throw new Error("All download sources failed");
          }
        }
      }
    } catch (error) {
      progress.status = "error";
      progress.message = `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onProgress?.(progress);
      throw error;
    }
  }

  private async attemptDownload(
    source: string,
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // Create a hidden iframe to access the video content
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = source;
      
      iframe.onload = () => {
        try {
          // Try to extract video URL from iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (!iframeDoc) {
            reject(new Error("Cannot access iframe content"));
            return;
          }

          // Look for video elements
          const videoElements = iframeDoc.querySelectorAll('video');
          if (videoElements.length > 0) {
            const videoElement = videoElements[0];
            const videoSrc = videoElement.src || videoElement.currentSrc;
            
            if (videoSrc) {
              this.downloadVideoFile(videoSrc, downloadInfo, onProgress)
                .then(resolve)
                .catch(reject);
            } else {
              reject(new Error("No video source found"));
            }
          } else {
            // Try to find video source in script tags or other elements
            const scripts = Array.from(iframeDoc.querySelectorAll('script'));
            for (const script of scripts) {
              const content = script.textContent || script.innerHTML;
              const videoUrlMatch = content.match(/https?:\/\/[^"'\s]+\.(?:mp4|m3u8|webm)[^"'\s]*/i);
              if (videoUrlMatch) {
                this.downloadVideoFile(videoUrlMatch[0], downloadInfo, onProgress)
                  .then(resolve)
                  .catch(reject);
                return;
              }
            }
            reject(new Error("No video source found in iframe"));
          }
        } catch (error) {
          reject(error);
        } finally {
          document.body.removeChild(iframe);
        }
      };

      iframe.onerror = () => {
        document.body.removeChild(iframe);
        reject(new Error("Failed to load iframe"));
      };

      document.body.appendChild(iframe);
    });
  }

  private async downloadVideoFile(
    videoUrl: string,
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      xhr.open('GET', videoUrl, true);
      xhr.responseType = 'blob';
      
      xhr.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          const downloadId = this.generateDownloadId(downloadInfo);
          const currentProgress = this.downloads.get(downloadId);
          
          if (currentProgress) {
            currentProgress.progress = progress;
            currentProgress.message = `Downloading: ${Math.round(progress)}%`;
            onProgress?.(currentProgress);
          }
        }
      };
      
      xhr.onload = () => {
        if (xhr.status === 200) {
          const blob = xhr.response;
          const url = window.URL.createObjectURL(blob);
          
          // Create download link
          const a = document.createElement('a');
          a.href = url;
          a.download = this.generateFileName(downloadInfo);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          
          // Clean up
          window.URL.revokeObjectURL(url);
          resolve();
        } else {
          reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
        }
      };
      
      xhr.onerror = () => {
        reject(new Error('Network error occurred'));
      };
      
      xhr.send();
    });
  }

  private generateDownloadId(downloadInfo: DownloadInfo): string {
    if (downloadInfo.mediaType === "movie") {
      return `movie_${downloadInfo.title}_${Date.now()}`;
    } else {
      return `tv_${downloadInfo.title}_s${downloadInfo.seasonId}e${downloadInfo.episodeId}_${Date.now()}`;
    }
  }

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

  getDownloadProgress(downloadId: string): DownloadProgress | undefined {
    return this.downloads.get(downloadId);
  }

  clearDownload(downloadId: string): void {
    this.downloads.delete(downloadId);
  }

  // Alternative download method using fetch API
  async downloadWithFetch(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const downloadId = this.generateDownloadId(downloadInfo);
    
    const progress: DownloadProgress = {
      progress: 0,
      status: "downloading",
      message: "Attempting download..."
    };
    
    this.downloads.set(downloadId, progress);
    onProgress?.(progress);

    try {
      // For embedded videos, we'll create a download link that opens the video in a new tab
      // This is a fallback method when direct download isn't possible
      const sourceUrl = downloadInfo.sources[0];
      
      // Create a download link that opens the video source
      const a = document.createElement('a');
      a.href = sourceUrl;
      a.target = '_blank';
      a.download = this.generateFileName(downloadInfo);
      a.rel = 'noopener noreferrer';
      
      // Add a custom attribute to indicate this is a video download
      a.setAttribute('data-video-download', 'true');
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "Download link opened in new tab";
      onProgress?.(progress);
      
    } catch (error) {
      progress.status = "error";
      progress.message = `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onProgress?.(progress);
      throw error;
    }
  }

  // Method to create a direct download link for the video source
  async createDirectDownloadLink(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const downloadId = this.generateDownloadId(downloadInfo);
    
    const progress: DownloadProgress = {
      progress: 0,
      status: "downloading",
      message: "Creating download link..."
    };
    
    this.downloads.set(downloadId, progress);
    onProgress?.(progress);

    try {
      // Create a download link for each source
      downloadInfo.sources.forEach((source, index) => {
        const a = document.createElement('a');
        a.href = source;
        a.target = '_blank';
        a.download = `${this.generateFileName(downloadInfo)}_source${index + 1}`;
        a.rel = 'noopener noreferrer';
        a.className = 'download-link';
        a.textContent = `Download Source ${index + 1}`;
        
        // Style the link
        a.style.cssText = `
          display: inline-block;
          margin: 5px;
          padding: 8px 16px;
          background: #3b82f6;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          font-size: 14px;
        `;
        
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
      
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "Download links created successfully!";
      onProgress?.(progress);
      
    } catch (error) {
      progress.status = "error";
      progress.message = `Failed to create download links: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onProgress?.(progress);
      throw error;
    }
  }

  // Method to attempt direct video extraction and download
  async downloadDirectVideo(
    downloadInfo: DownloadInfo,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<void> {
    const downloadId = this.generateDownloadId(downloadInfo);
    
    const progress: DownloadProgress = {
      progress: 0,
      status: "downloading",
      message: "Extracting video source..."
    };
    
    this.downloads.set(downloadId, progress);
    onProgress?.(progress);

    try {
      // Try each source until one works
      for (let i = 0; i < downloadInfo.sources.length; i++) {
        const source = downloadInfo.sources[i];
        progress.message = `Trying source ${i + 1}/${downloadInfo.sources.length}...`;
        onProgress?.(progress);
        
        try {
          // Create a hidden iframe to access the video content
          const iframe = document.createElement('iframe');
          iframe.style.display = 'none';
          iframe.src = source;
          
          await new Promise<void>((resolve, reject) => {
            const timeout = setTimeout(() => {
              reject(new Error('Source timeout'));
            }, 10000); // 10 second timeout
            
            iframe.onload = () => {
              clearTimeout(timeout);
              try {
                // Try to extract video URL from iframe
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                if (!iframeDoc) {
                  reject(new Error("Cannot access iframe content"));
                  return;
                }

                // Look for video elements
                const videoElements = iframeDoc.querySelectorAll('video');
                if (videoElements.length > 0) {
                  const videoElement = videoElements[0];
                  const videoSrc = videoElement.src || videoElement.currentSrc;
                  
                  if (videoSrc) {
                    progress.message = "Found video source, starting download...";
                    onProgress?.(progress);
                    
                    this.downloadVideoFile(videoSrc, downloadInfo, onProgress)
                      .then(() => {
                        document.body.removeChild(iframe);
                        resolve();
                      })
                      .catch(reject);
                    return;
                  }
                }
                
                // Try to find video source in script tags
                const scripts = Array.from(iframeDoc.querySelectorAll('script'));
                for (const script of scripts) {
                  const content = script.textContent || script.innerHTML;
                  const videoUrlMatch = content.match(/https?:\/\/[^"'\s]+\.(?:mp4|m3u8|webm)[^"'\s]*/i);
                  if (videoUrlMatch) {
                    progress.message = "Found video URL in scripts, starting download...";
                    onProgress?.(progress);
                    
                    this.downloadVideoFile(videoUrlMatch[0], downloadInfo, onProgress)
                      .then(() => {
                        document.body.removeChild(iframe);
                        resolve();
                      })
                      .catch(reject);
                    return;
                  }
                }
                
                reject(new Error("No video source found in this source"));
              } catch (error) {
                reject(error);
              }
            };
            
            iframe.onerror = () => {
              clearTimeout(timeout);
              reject(new Error("Failed to load iframe"));
            };
            
            document.body.appendChild(iframe);
          });
          
          // If we get here, download was successful
          return;
          
        } catch (error) {
          console.warn(`Source ${i + 1} failed:`, error);
          // Continue to next source
        }
      }
      
      // If all sources failed, fall back to opening the first source in a new tab
      progress.message = "All direct sources failed, opening download link...";
      onProgress?.(progress);
      
      const a = document.createElement('a');
      a.href = downloadInfo.sources[0];
      a.target = '_blank';
      a.download = this.generateFileName(downloadInfo);
      a.rel = 'noopener noreferrer';
      
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      progress.status = "completed";
      progress.progress = 100;
      progress.message = "Download link opened in new tab";
      onProgress?.(progress);
      
    } catch (error) {
      progress.status = "error";
      progress.message = `Download failed: ${error instanceof Error ? error.message : 'Unknown error'}`;
      onProgress?.(progress);
      throw error;
    }
  }

  // Method to check if download is supported
  isDownloadSupported(): boolean {
    return 'download' in document.createElement('a') && 
           'createObjectURL' in window.URL &&
           'revokeObjectURL' in window.URL;
  }

  // Method to get download size estimate (if available)
  async getDownloadSizeEstimate(videoUrl: string): Promise<string | null> {
    try {
      const response = await fetch(videoUrl, { method: 'HEAD' });
      const contentLength = response.headers.get('content-length');
      
      if (contentLength) {
        const bytes = parseInt(contentLength, 10);
        const mb = (bytes / (1024 * 1024)).toFixed(1);
        return `${mb} MB`;
      }
      
      return null;
    } catch (error) {
      console.warn('Could not get download size estimate:', error);
      return null;
    }
  }
}

export const downloadService = DownloadService.getInstance();
