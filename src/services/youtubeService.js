// Get environment variables
const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY
const CHANNEL_ID = import.meta.env.VITE_YOUTUBE_CHANNEL_ID

// Log for debugging
console.log('📢 ENV CHECK:')
console.log('- API Key exists:', API_KEY ? '✅ YES' : '❌ NO')
console.log('- API Key length:', API_KEY?.length || 0)
console.log('- Channel ID:', CHANNEL_ID || 'MISSING')

export const fetchYouTubeVideos = async () => {
  try {
    if (!API_KEY) throw new Error('API_KEY is missing in .env file')
    if (!CHANNEL_ID) throw new Error('CHANNEL_ID is missing in .env file')
    
    console.log('Fetching channel data...')
    const channelResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
    )
    const channelData = await channelResponse.json()
    
    if (channelData.error) {
      throw new Error(`YouTube API Error: ${channelData.error.message}`)
    }
    
    if (!channelData.items?.length) {
      throw new Error('Channel not found - check Channel ID')
    }
    
    const playlistId = channelData.items[0].contentDetails.relatedPlaylists.uploads
    console.log('Playlist ID:', playlistId)
    
    const videosResponse = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`
    )
    const videosData = await videosResponse.json()
    
    if (videosData.error) {
      throw new Error(`YouTube API Error: ${videosData.error.message}`)
    }
    
    console.log(`Found ${videosData.items?.length || 0} videos`)
    return videosData.items || []
    
  } catch (error) {
    console.error('❌ Error:', error.message)
    throw error
  }
}

export const testYouTubeAPI = async () => {
  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${CHANNEL_ID}&key=${API_KEY}`
    )
    const data = await response.json()
    return !data.error && data.items?.length > 0
  } catch (error) {
    return false
  }
}