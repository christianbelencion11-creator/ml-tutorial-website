import React, { useState, useEffect, useRef } from 'react'
import { database, storage } from '../firebase'
import { ref, push, onValue, set, remove } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { Link } from 'react-router-dom'
import {
  FaCommentDots, FaTimes, FaPaperPlane, FaGamepad,
  FaImage, FaCheckCircle, FaArrowLeft, FaShieldAlt,
  FaCircle, FaSmile, FaPaperclip
} from 'react-icons/fa'

function getUserIdentity() {
  let userId = localStorage.getItem('pmc_chat_user_id')
  let userName = localStorage.getItem('pmc_chat_user_name')
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
    const num = Math.floor(Math.random() * 9000) + 1000
    userName = `Player #${num}`
    localStorage.setItem('pmc_chat_user_id', userId)
    localStorage.setItem('pmc_chat_user_name', userName)
  }
  return { userId, userName }
}

export default function ConvoPage() {
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [ended, setEnded] = useState(false)
  const messagesContainerRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const { userId, userName } = getUserIdentity()

  useEffect(() => {
    document.title = 'PMC Support Chat'
    const now = Date.now()
    localStorage.setItem('pmc_last_seen', now.toString())
    set(ref(database, `chats/${userId}/info`), {
      userName, userId, lastSeen: now,
      page: '/chat', status: 'open'
    })
  }, [userId, userName])

  useEffect(() => {
    const chatRef = ref(database, `chats/${userId}/messages`)
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const msgs = Object.entries(data)
          .map(([key, val]) => ({ id: key, ...val }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        setMessages(msgs)
        // Mark as seen
        localStorage.setItem('pmc_last_seen', Date.now().toString())
      } else {
        setMessages([])
      }
    })
    return () => unsubscribe()
  }, [userId])

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (text = inputText, type = 'text', imageUrl = null) => {
    if ((!text.trim() && !imageUrl) || sending) return
    setSending(true)
    const chatRef = ref(database, `chats/${userId}/messages`)
    await push(chatRef, {
      text: text.trim(), sender: 'user', userName,
      timestamp: Date.now(), type,
      ...(imageUrl && { imageUrl })
    })
    set(ref(database, `chats/${userId}/info`), {
      userName, userId,
      lastMessage: type === 'image' ? '📷 Image' : text.trim().substring(0, 60),
      lastMessageTime: Date.now(), unreadByAdmin: true,
      page: '/chat', status: 'open'
    })
    setInputText('')
    setSending(false)
    inputRef.current?.focus()
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB lang'); return }
    setUploadingImage(true)
    try {
      const path = `chat-images/${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const imgRef = storageRef(storage, path)
      await uploadBytes(imgRef, file, { contentType: file.type })
      const url = await getDownloadURL(imgRef)
      await sendMessage('📷 Image', 'image', url)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Check Firebase Storage rules.')
    }
    setUploadingImage(false)
    e.target.value = ''
  }

  const handleEnd = async () => {
    try {
      for (const msg of messages) {
        if (msg.imageUrl) {
          try {
            const url = new URL(msg.imageUrl)
            const path = decodeURIComponent(url.pathname.split('/o/')[1].split('?')[0])
            await deleteObject(storageRef(storage, path))
          } catch {}
        }
      }
      await remove(ref(database, `chats/${userId}`))
      setMessages([])
      setEnded(true)
    } catch (err) { console.error(err) }
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
  }

  const formatDateDivider = (ts) => {
    if (!ts) return ''
    const d = new Date(ts)
    const now = new Date()
    if (d.toDateString() === now.toDateString()) return 'Today'
    const yesterday = new Date(now)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })
  }

  // Group messages by date for dividers
  const groupedMessages = []
  let lastDate = null
  messages.forEach((msg) => {
    const msgDate = msg.timestamp ? new Date(msg.timestamp).toDateString() : null
    if (msgDate && msgDate !== lastDate) {
      groupedMessages.push({ type: 'divider', date: msg.timestamp, label: formatDateDivider(msg.timestamp) })
      lastDate = msgDate
    }
    groupedMessages.push({ type: 'message', ...msg })
  })

  return (
    <div className="cp-root">
      {/* Header */}
      <div className="cp-header">
        <Link to="/" className="cp-back-btn" title="Back to site">
          <FaArrowLeft size={14} />
        </Link>
        <div className="cp-header-avatar">
          <FaShieldAlt size={16} />
          <span className="cp-online-dot" />
        </div>
        <div className="cp-header-info">
          <div className="cp-header-name">PMC Support</div>
          <div className="cp-header-status">
            <FaCircle size={7} style={{ color: '#22c55e' }} /> Online — Usually replies instantly
          </div>
        </div>
        <button className="cp-end-btn" onClick={() => setShowEndConfirm(true)} title="End conversation">
          <FaTimes size={13} /> End Chat
        </button>
      </div>

      {/* End confirm modal */}
      {showEndConfirm && (
        <div className="cp-modal-overlay">
          <div className="cp-modal">
            <div className="cp-modal-icon"><FaTimes size={20} style={{ color: '#ff4444' }} /></div>
            <h4>End Conversation?</h4>
            <p>All messages and images will be permanently deleted.</p>
            <div className="cp-modal-btns">
              <button className="cp-modal-confirm" onClick={handleEnd}>Yes, End It</button>
              <button className="cp-modal-cancel" onClick={() => setShowEndConfirm(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Ended state */}
      {ended ? (
        <div className="cp-ended">
          <FaCheckCircle size={48} style={{ color: '#22c55e', marginBottom: '16px' }} />
          <h3>Conversation Ended</h3>
          <p>Thanks for chatting with PMC Gaming Support! 🎮</p>
          <Link to="/" className="cp-go-home">← Back to Home</Link>
        </div>
      ) : (
        <>
          {/* Messages area */}
          <div className="cp-messages" ref={messagesContainerRef}>
            {/* Welcome message */}
            <div className="cp-welcome">
              <div className="cp-welcome-icon"><FaGamepad size={28} /></div>
              <div className="cp-welcome-title">PMC Gaming Support</div>
              <div className="cp-welcome-text">
                Hi <strong>{userName}</strong>! Ask us anything about Mobile Legends — hero guides, builds, strategies, or tips. We usually reply within minutes! 🎮
              </div>
            </div>

            {groupedMessages.length === 0 && (
              <div className="cp-no-msgs">
                <FaCommentDots size={32} style={{ color: '#1e1e1e', marginBottom: '8px' }} />
                <p>No messages yet. Say hi! 👋</p>
              </div>
            )}

            {groupedMessages.map((item, i) => {
              if (item.type === 'divider') {
                return (
                  <div key={`div-${i}`} className="cp-date-divider">
                    <span>{item.label}</span>
                  </div>
                )
              }
              const isUser = item.sender === 'user'
              return (
                <div key={item.id} className={`cp-msg-row ${isUser ? 'cp-msg-right' : 'cp-msg-left'}`}>
                  {!isUser && (
                    <div className="cp-msg-avatar"><FaShieldAlt size={12} /></div>
                  )}
                  <div className="cp-msg-content">
                    {!isUser && <div className="cp-msg-sender">PMC Support</div>}
                    <div className={`cp-bubble ${isUser ? 'cp-bubble-user' : 'cp-bubble-admin'}`}>
                      {item.type === 'image' && item.imageUrl ? (
                        <img
                          src={item.imageUrl} alt="uploaded"
                          className="cp-img"
                          onClick={() => window.open(item.imageUrl, '_blank')}
                        />
                      ) : item.text}
                    </div>
                    <div className={`cp-msg-time ${isUser ? 'cp-time-right' : ''}`}>
                      {formatTime(item.timestamp)}
                      {isUser && <span className="cp-seen">✓✓</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Input area */}
          <div className="cp-input-bar">
            <input
              type="file" ref={fileInputRef}
              accept="image/*" onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              className="cp-attach-btn"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingImage}
              title="Send image"
            >
              {uploadingImage
                ? <span className="cp-spinner" />
                : <FaImage size={16} />
              }
            </button>
            <input
              ref={inputRef}
              type="text"
              className="cp-input"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  sendMessage()
                }
              }}
              maxLength={1000}
            />
            <button
              className={`cp-send-btn ${inputText.trim() ? 'cp-send-active' : ''}`}
              onClick={() => sendMessage()}
              disabled={!inputText.trim() || sending}
            >
              <FaPaperPlane size={16} />
            </button>
          </div>

          <div className="cp-footer-bar">
            Chatting as <strong>{userName}</strong> · <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>pmcgaming.vercel.app</Link>
          </div>
        </>
      )}
    </div>
  )
}