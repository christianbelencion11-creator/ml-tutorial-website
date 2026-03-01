import React, { useState, useEffect, useRef, useCallback } from 'react'
import { database, storage } from '../firebase'
import { ref, push, onValue, set, remove } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { FaCommentDots, FaTimes, FaPaperPlane, FaGamepad, FaImage, FaCheckCircle } from 'react-icons/fa'

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

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastSeenTimestamp] = useState(parseInt(localStorage.getItem('pmc_last_seen') || '0'))
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [ended, setEnded] = useState(false)

  // Draggable state
  const [pos, setPos] = useState({ x: null, y: null })
  const [dragging, setDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [hasDragged, setHasDragged] = useState(false)
  const dragRef = useRef(null)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const { userId, userName } = getUserIdentity()

  // Set default position bottom-right on mount
  useEffect(() => {
    const saved = localStorage.getItem('pmc_chat_pos')
    if (saved) {
      setPos(JSON.parse(saved))
    } else {
      setPos({ x: window.innerWidth - 80, y: window.innerHeight - 80 })
    }
  }, [])

  // Drag handlers
  const onDragStart = useCallback((clientX, clientY) => {
    if (!dragRef.current) return
    const rect = dragRef.current.getBoundingClientRect()
    setDragOffset({ x: clientX - rect.left - rect.width / 2, y: clientY - rect.top - rect.height / 2 })
    setDragging(true)
    setHasDragged(false)
  }, [])

  const onDragMove = useCallback((clientX, clientY) => {
    if (!dragging) return
    setHasDragged(true)
    const newX = Math.min(Math.max(28, clientX - dragOffset.x), window.innerWidth - 28)
    const newY = Math.min(Math.max(28, clientY - dragOffset.y), window.innerHeight - 28)
    setPos({ x: newX, y: newY })
  }, [dragging, dragOffset])

  const onDragEnd = useCallback(() => {
    if (dragging) {
      setDragging(false)
      if (pos.x !== null) localStorage.setItem('pmc_chat_pos', JSON.stringify(pos))
    }
  }, [dragging, pos])

  useEffect(() => {
    if (!dragging) return
    const onMouseMove = (e) => onDragMove(e.clientX, e.clientY)
    const onTouchMove = (e) => { e.preventDefault(); onDragMove(e.touches[0].clientX, e.touches[0].clientY) }
    const onUp = () => onDragEnd()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, onDragMove, onDragEnd])

  // Listen for contact form open event
  useEffect(() => {
    const handleOpenChat = (e) => {
      setIsOpen(true)
      if (e.detail?.message) {
        setInputText(e.detail.message)
        setTimeout(() => inputRef.current?.focus(), 300)
      }
    }
    window.addEventListener('pmc_open_chat', handleOpenChat)
    return () => window.removeEventListener('pmc_open_chat', handleOpenChat)
  }, [])

  // Messages
  useEffect(() => {
    const chatRef = ref(database, `chats/${userId}/messages`)
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const msgs = Object.entries(data).map(([key, val]) => ({ id: key, ...val }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        setMessages(msgs)
        if (!isOpen) {
          const unread = msgs.filter(m => m.sender === 'admin' && (m.timestamp || 0) > lastSeenTimestamp).length
          setUnreadCount(unread)
        }
      } else { setMessages([]) }
    })
    return () => unsubscribe()
  }, [userId, isOpen, lastSeenTimestamp])

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isOpen])

  useEffect(() => {
    if (isOpen) {
      const now = Date.now()
      localStorage.setItem('pmc_last_seen', now.toString())
      setUnreadCount(0)
      inputRef.current?.focus()
      set(ref(database, `chats/${userId}/info`), {
        userName, userId, lastSeen: now, page: window.location.pathname, status: 'open'
      })
    }
  }, [isOpen, userId, userName])

  const sendMessage = async (text = inputText, type = 'text', imageUrl = null) => {
    if ((!text.trim() && !imageUrl) || sending) return
    setSending(true)
    const chatRef = ref(database, `chats/${userId}/messages`)
    await push(chatRef, {
      text: text.trim(), sender: 'user', userName,
      timestamp: Date.now(), type, ...(imageUrl && { imageUrl })
    })
    set(ref(database, `chats/${userId}/info`), {
      userName, userId,
      lastMessage: type === 'image' ? '📷 Image' : text.trim().substring(0, 60),
      lastMessageTime: Date.now(), unreadByAdmin: true,
      page: window.location.pathname, status: 'open'
    })
    setInputText('')
    setSending(false)
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Image must be under 5MB'); return }
    setUploadingImage(true)
    try {
      const path = `chat-images/${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const imgRef = storageRef(storage, path)
      const metadata = { contentType: file.type }
      await uploadBytes(imgRef, file, metadata)
      const url = await getDownloadURL(imgRef)
      await sendMessage('📷 Image', 'image', url)
    } catch (err) {
      console.error('Upload failed:', err)
      alert('Upload failed. Check Firebase Storage rules.')
    }
    setUploadingImage(false)
    e.target.value = ''
  }

  const handleEndConversation = async () => {
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
      setTimeout(() => { setEnded(false); setIsOpen(false); setShowEndConfirm(false) }, 2500)
    } catch (err) { console.error(err) }
  }

  const formatTime = (ts) => ts ? new Date(ts).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : ''

  // Determine chat window position - snap to left or right side
  const isLeft = pos.x !== null && pos.x < window.innerWidth / 2
  const windowStyle = pos.x !== null ? {
    position: 'fixed',
    bottom: `${window.innerHeight - pos.y - 28}px`,
    ...(isLeft ? { left: `${pos.x - 14}px` } : { right: `${window.innerWidth - pos.x - 28}px` }),
    top: 'auto', transform: 'none',
    zIndex: 9997,
  } : {}

  if (pos.x === null) return null

  return (
    <>
      {isOpen && (
        <div className="cw-window" style={windowStyle}>
          <div className="cw-header">
            <div className="cw-header-left">
              <div className="cw-avatar"><FaGamepad size={15} /></div>
              <div>
                <div className="cw-header-title">PMC Support</div>
                <div className="cw-header-status"><span className="cw-dot" /> Online</div>
              </div>
            </div>
            <div className="cw-header-actions">
              <button className="cw-end-btn" onClick={() => setShowEndConfirm(true)}>✕ End</button>
              <button className="cw-close-btn" onClick={() => setIsOpen(false)}><FaTimes size={13} /></button>
            </div>
          </div>

          {showEndConfirm && (
            <div className="cw-confirm-overlay">
              <div className="cw-confirm-box">
                <p>End this conversation?</p>
                <small>All messages and images will be deleted.</small>
                <div className="cw-confirm-btns">
                  <button className="cw-confirm-yes" onClick={handleEndConversation}>Yes, End</button>
                  <button className="cw-confirm-no" onClick={() => setShowEndConfirm(false)}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {ended ? (
            <div className="cw-ended">
              <FaCheckCircle size={32} style={{ color: '#22c55e', marginBottom: '8px' }} />
              <p>Conversation ended!</p>
              <small>Thanks for chatting with PMC Support 🎮</small>
            </div>
          ) : (
            <>
              <div className="cw-messages">
                <div className="cw-system-msg">Welcome, <strong>{userName}</strong>! Ask us anything about MLBB. 🎮</div>
                {messages.length === 0 && (
                  <div className="cw-empty"><FaCommentDots size={26} style={{ color: '#2a2a2a', marginBottom: '8px' }} /><p>No messages yet</p></div>
                )}
                {messages.map((msg) => (
                  <div key={msg.id} className={`cw-bubble-wrap ${msg.sender === 'user' ? 'cw-right' : 'cw-left'}`}>
                    {msg.sender === 'admin' && <div className="cw-sender-name">PMC Support</div>}
                    <div className={`cw-bubble ${msg.sender === 'user' ? 'cw-bubble-user' : 'cw-bubble-admin'}`}>
                      {msg.type === 'image' && msg.imageUrl
                        ? <img src={msg.imageUrl} alt="uploaded" className="cw-img-preview" onClick={() => window.open(msg.imageUrl, '_blank')} />
                        : msg.text}
                    </div>
                    <div className={`cw-time ${msg.sender === 'user' ? 'cw-time-right' : ''}`}>{formatTime(msg.timestamp)}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              <div className="cw-input-area">
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                <button className="cw-img-btn" onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}>
                  {uploadingImage ? <span className="cw-upload-spinner" /> : <FaImage size={14} />}
                </button>
                <input ref={inputRef} type="text" className="cw-input" placeholder="Type a message..."
                  value={inputText} onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  maxLength={500} />
                <button className="cw-send-btn" onClick={() => sendMessage()} disabled={!inputText.trim() || sending}>
                  <FaPaperPlane size={13} />
                </button>
              </div>
              <div className="cw-footer-tag">Chatting as <strong>{userName}</strong></div>
            </>
          )}
        </div>
      )}

      {/* Draggable toggle bubble */}
      <div
        ref={dragRef}
        className={`cw-toggle ${dragging ? 'cw-dragging' : ''}`}
        style={{ left: `${pos.x}px`, top: `${pos.y}px`, transform: 'translate(-50%, -50%)' }}
        onMouseDown={(e) => { e.preventDefault(); onDragStart(e.clientX, e.clientY) }}
        onTouchStart={(e) => { onDragStart(e.touches[0].clientX, e.touches[0].clientY) }}
        onClick={() => { if (!hasDragged) setIsOpen(!isOpen) }}
      >
        {isOpen ? <FaTimes size={21} /> : <FaCommentDots size={21} />}
        {!isOpen && unreadCount > 0 && <span className="cw-badge">{unreadCount}</span>}
        {!isOpen && <span className="cw-drag-hint">⠿</span>}
      </div>
    </>
  )
}

export default ChatWidget