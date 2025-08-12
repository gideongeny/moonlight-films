# Download Feature for Moonlight Films

## Overview

The download feature allows users to download movies and TV show episodes to their local device storage for offline viewing. This feature is integrated into the video player interface and provides multiple download options.

## Features

### 1. Multiple Download Methods
- **Direct Download**: Attempts to download the video file directly to the user's device
- **Download Link**: Opens the video source in a new tab for manual download
- **Multiple Source Links**: Creates download links for all available video sources

### 2. Progress Tracking
- Real-time download progress indicator
- Status messages showing current operation
- Error handling with user-friendly messages

### 3. Cross-Platform Support
- Works on desktop and mobile browsers
- Supports multiple video formats (MP4, M3U8, WebM)
- Fallback methods for different browser capabilities

## How It Works

### Video Source Detection
The download service attempts to extract video URLs from embedded video players by:
1. Creating a hidden iframe to access the video content
2. Scanning for video elements and their sources
3. Parsing script tags for video URLs
4. Using multiple fallback sources if one fails

### Download Process
1. **Source Selection**: The system tries multiple video sources until one works
2. **Content Extraction**: Extracts the actual video URL from the embedded player
3. **File Download**: Downloads the video file using XMLHttpRequest with progress tracking
4. **File Naming**: Automatically generates appropriate filenames based on content type

## Usage

### For Users
1. Navigate to any movie or TV show episode
2. Click the "Download" button in the video player controls
3. Choose from the available download options:
   - **Download Movie**: Direct download (recommended)
   - **Open Download Link**: Alternative method
   - **Create Multiple Download Links**: For advanced users

### For Developers
The download feature is implemented through several components:

#### DownloadService (`src/services/download.ts`)
- Main service class handling all download operations
- Singleton pattern for consistent state management
- Progress tracking and error handling

#### DownloadOptions (`src/components/Common/DownloadOptions.tsx`)
- User interface component for download options
- Progress indicators and status messages
- Multiple download method support

#### Integration in FilmWatch (`src/components/FilmWatch/FilmWatch.tsx`)
- Download button in video player controls
- Download section in movie information area
- Automatic download info generation

## Technical Implementation

### Key Components

1. **DownloadService Class**
   ```typescript
   class DownloadService {
     generateDownloadInfo(detail, mediaType, seasonId?, episodeId?, currentEpisode?)
     downloadMovie(downloadInfo, onProgress?)
     downloadWithFetch(downloadInfo, onProgress?)
     createDirectDownloadLink(downloadInfo, onProgress?)
   }
   ```

2. **DownloadInfo Interface**
   ```typescript
   interface DownloadInfo {
     title: string;
     mediaType: "movie" | "tv";
     seasonId?: number;
     episodeId?: number;
     episodeName?: string;
     sources: string[];
     posterPath?: string;
     overview?: string;
   }
   ```

3. **DownloadProgress Interface**
   ```typescript
   interface DownloadProgress {
     progress: number;
     status: "idle" | "downloading" | "completed" | "error";
     message: string;
   }
   ```

### Browser Compatibility

The download feature supports:
- Modern browsers with download API support
- Fallback methods for older browsers
- Mobile browser compatibility
- Cross-origin resource handling

### Error Handling

The system includes comprehensive error handling:
- Network error detection
- Source availability checking
- Browser capability detection
- User-friendly error messages
- Automatic fallback to alternative methods

## Security Considerations

1. **Cross-Origin Restrictions**: The feature handles CORS limitations gracefully
2. **Content Security Policy**: Respects CSP restrictions
3. **User Consent**: All downloads require explicit user action
4. **File Validation**: Validates downloaded content before saving

## Limitations

1. **Embedded Content**: Download success depends on the embedded video service
2. **Browser Restrictions**: Some browsers may block certain download methods
3. **File Size**: Large files may take time to download
4. **Network Dependencies**: Requires stable internet connection for initial setup

## Future Enhancements

Potential improvements for the download feature:
1. **Resume Downloads**: Support for interrupted download resumption
2. **Quality Selection**: Allow users to choose video quality
3. **Batch Downloads**: Download multiple episodes at once
4. **Storage Management**: Track and manage downloaded content
5. **Offline Library**: Built-in offline content management

## Troubleshooting

### Common Issues

1. **Download Fails**: Try the alternative download method
2. **Slow Downloads**: Check internet connection and try different sources
3. **File Not Found**: The video source may be temporarily unavailable
4. **Browser Blocked**: Check browser settings and disable ad blockers

### Debug Information

The download service provides detailed logging for troubleshooting:
- Source availability status
- Download progress details
- Error messages and stack traces
- Browser capability information

## Support

For issues with the download feature:
1. Check browser compatibility
2. Verify internet connection
3. Try alternative download methods
4. Check browser console for error messages
5. Contact support with specific error details
