const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY
const CHANNEL_ID = process.env.REACT_APP_YOUTUBE_CHANNEL_ID

export const fetchYouTubeVideos = async () => {
  try {
    console.log('Fetching YouTube videos...')
    
    // Get channel details
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    )
    const channelData = await channelResponse.json()
    
    if (!channelData.items || channelData.items.length === 0) {
      throw new Error('Channel not found')
    }
    
    const playlistId = channelData.items[0].contentDetails.relatedPlaylists.uploads
    console.log('Playlist ID:', playlistId)
    
    // Get latest videos
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=10&playlistId=${playlistId}&key=${API_KEY}`
    )
    const videosData = await videosResponse.json()
    
    console.log('Videos found:', videosData.items?.length || 0)
    
    return videosData.items.map(item => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnail: item.snippet.thumbnails.high.url,
      publishedAt: item.snippet.publishedAt,
      videoUrl: `https://www.youtube.com/watch?v=${item.snippet.resourceId.videoId}`,
      embedUrl: `https://www.youtube.com/embed/${item.snippet.resourceId.videoId}`
    }))
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return []
  }
}

// Test function to verify API key
export const testYouTubeAPI = async () => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
    )
    const data = await response.json()
    return data.items && data.items.length > 0
  } catch (error) {
    console.error('API test failed:', error)
    return false
  }
}