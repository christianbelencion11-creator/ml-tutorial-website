import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD5I6hkbTonOvJewMPTnXyHPLinv0CNhlc",
  authDomain: "pmc-gaming-tutorials.firebaseapp.com",
  databaseURL: "https://pmc-gaming-tutorials-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pmc-gaming-tutorials",
  storageBucket: "pmc-gaming-tutorials.firebasestorage.app",
  messagingSenderId: "415858410544",
  appId: "1:415858410544:web:2449891c7a359e596059f5",
  measurementId: "G-S84CSXYDF9"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

export { database }