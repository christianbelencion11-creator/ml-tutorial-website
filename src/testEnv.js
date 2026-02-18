// Test if environment variables are loading
console.log('🧪 TESTING ENVIRONMENT VARIABLES:')
console.log('VITE_YOUTUBE_API_KEY exists:', !!import.meta.env.VITE_YOUTUBE_API_KEY)
console.log('VITE_YOUTUBE_CHANNEL_ID:', import.meta.env.VITE_YOUTUBE_CHANNEL_ID || 'MISSING')
console.log('All env vars:', import.meta.env)