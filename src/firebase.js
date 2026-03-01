import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyD5I6hkbTonOvJewMPTnXyHPLinv0CNhlc",
  authDomain: "pmc-gaming-tutorials.firebaseapp.com",
  databaseURL: "https://pmc-gaming-tutorials-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "pmc-gaming-tutorials",
  storageBucket: "pmc-gaming-tutorials.appspot.com",
  messagingSenderId: "415858410544",
  appId: "1:415858410544:web:2449891c7a359e596059f5",
  measurementId: "G-S84CSXYDF9"
}

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)
const storage = getStorage(app)

export { database, storage }