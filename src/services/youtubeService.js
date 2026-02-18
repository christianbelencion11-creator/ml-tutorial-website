const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY || process.env.REACT_APP_YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID || process.env.REACT_APP_YOUTUBE_CHANNEL_ID

// Function to get ALL videos (with pagination)
export const fetchYouTubeVideos = async () => {
  try {
    console.log('Fetching videos for channel:', CHANNEL_ID)
    
    // First, get the uploads playlist ID
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    )
    const channelData = await channelResponse.json()
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found')
    }
    
    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads
    console.log('Uploads playlist ID:', uploadsPlaylistId)
    
    // Get ALL videos from the uploads playlist (with pagination)
    let allVideos = []
    let nextPageToken = ''
    let pageCount = 0
    
    do {
      const playlistResponse = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsPlaylistId}&key=${API_KEY}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`
      )
      const playlistData = await playlistResponse.json()
      
      if (playlistData.error) {
        throw new Error(playlistData.error.message)
      }
      
      allVideos = [...allVideos, ...playlistData.items]
      nextPageToken = playlistData.nextPageToken || ''
      pageCount++
      
      console.log(`Fetched page ${pageCount}: ${playlistData.items.length} videos`)
      
      // Safety limit: maximum 10 pages (500 videos)
      if (pageCount >= 10) break
      
    } while (nextPageToken)
    
    console.log(`Total videos fetched: ${allVideos.length}`)
    
    // Convert to our format
    return allVideos.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default?.url,
      publishedAt: item.snippet.publishedAt,
      embedUrl: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`
    }))
    
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    throw error
  }
}

// Test function
export const testYouTubeAPI = async () => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
    )
    const data = await response.json()
    return !data.error && data.items && data.items.length > 0
  } catch (error) {
    return false
  }
}