import React, { useState, useEffect, useRef } from 'react'
import { database } from '../firebase'
import { ref, push, onValue, serverTimestamp, set } from 'firebase/database'
import { FaCommentDots, FaTimes, FaPaperPlane, FaGamepad } from 'react-icons/fa'

// Generate or retrieve persistent user identity
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
  const [lastSeenTimestamp, setLastSeenTimestamp] = useState(
    parseInt(localStorage.getItem('pmc_last_seen') || '0')
  )
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { userId, userName } = getUserIdentity()

  // Listen to messages in real-time
  useEffect(() => {
    const chatRef = ref(database, `chats/${userId}/messages`)
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const msgs = Object.entries(data).map(([key, val]) => ({
          id: key,
          ...val
        })).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        setMessages(msgs)

        // Count unread admin replies when chat is closed
        if (!isOpen) {
          const unread = msgs.filter(m =>
            m.sender === 'admin' &&
            (m.timestamp || 0) > lastSeenTimestamp
          ).length
          setUnreadCount(unread)
        }
      }
    })
    return () => unsubscribe()
  }, [userId, isOpen, lastSeenTimestamp])

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isOpen])

  // Mark as read when opened
  useEffect(() => {
    if (isOpen) {
      const now = Date.now()
      setLastSeenTimestamp(now)
      localStorage.setItem('pmc_last_seen', now.toString())
      setUnreadCount(0)
      inputRef.current?.focus()

      // Update user info in Firebase
      set(ref(database, `chats/${userId}/info`), {
        userName,
        userId,
        lastSeen: serverTimestamp(),
        page: window.location.pathname
      })
    }
  }, [isOpen, userId, userName])

  const sendMessage = async () => {
    if (!inputText.trim() || sending) return
    setSending(true)

    const chatRef = ref(database, `chats/${userId}/messages`)
    await push(chatRef, {
      text: inputText.trim(),
      sender: 'user',
      userName,
      timestamp: Date.now(),
    })

    // Update conversation preview for admin
    set(ref(database, `chats/${userId}/info`), {
      userName,
      userId,
      lastMessage: inputText.trim().substring(0, 60),
      lastMessageTime: Date.now(),
      unreadByAdmin: true,
      page: window.location.pathname
    })

    setInputText('')
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    return new Date(ts).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <>
      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-avatar">
                <FaGamepad size={16} />
              </div>
              <div>
                <div className="chat-header-title">PMC Support</div>
                <div className="chat-header-status">
                  <span className="chat-status-dot" /> Online
                </div>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <FaTimes size={14} />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {/* Welcome message */}
            <div className="chat-system-msg">
              Welcome, <strong>{userName}</strong>! Ask us anything about MLBB tutorials. 🎮
            </div>

            {messages.length === 0 && (
              <div className="chat-empty">
                <FaCommentDots size={28} style={{ color: '#333', marginBottom: '8px' }} />
                <p>No messages yet.<br />Send us a message!</p>
              </div>
            )}

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`chat-bubble-wrap ${msg.sender === 'user' ? 'chat-bubble-user-wrap' : 'chat-bubble-admin-wrap'}`}
              >
                {msg.sender === 'admin' && (
                  <div className="chat-bubble-name">PMC Support</div>
                )}
                <div className={`chat-bubble ${msg.sender === 'user' ? 'chat-bubble-user' : 'chat-bubble-admin'}`}>
                  {msg.text}
                </div>
                <div className={`chat-time ${msg.sender === 'user' ? 'chat-time-right' : 'chat-time-left'}`}>
                  {formatTime(msg.timestamp)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="chat-input-area">
            <input
              ref={inputRef}
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
            />
            <button
              className="chat-send-btn"
              onClick={sendMessage}
              disabled={!inputText.trim() || sending}
            >
              <FaPaperPlane size={14} />
            </button>
          </div>

          <div className="chat-footer-tag">
            Chatting as <strong>{userName}</strong>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        className="chat-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat"
      >
        {isOpen ? <FaTimes size={22} /> : <FaCommentDots size={22} />}
        {!isOpen && unreadCount > 0 && (
          <span className="chat-unread-badge">{unreadCount}</span>
        )}
      </button>
    </>
  )
}

export default ChatWidget