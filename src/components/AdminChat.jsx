import React, { useState, useEffect, useRef } from 'react'
import { database } from '../firebase'
import { ref, onValue, push, set, serverTimestamp } from 'firebase/database'
import { FaCommentDots, FaPaperPlane, FaUser, FaCircle, FaInbox } from 'react-icons/fa'

function AdminChat() {
  const [conversations, setConversations] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef(null)

  // Load all conversations
  useEffect(() => {
    const chatsRef = ref(database, 'chats/')
    onValue(chatsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const convos = Object.entries(data).map(([userId, val]) => ({
          userId,
          ...val.info,
          hasMessages: !!val.messages
        })).sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0))
        setConversations(convos)
      } else {
        setConversations([])
      }
    })
  }, [])

  // Load messages for selected conversation
  useEffect(() => {
    if (!selectedUserId) return

    const msgsRef = ref(database, `chats/${selectedUserId}/messages`)
    const unsubscribe = onValue(msgsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const msgs = Object.entries(data).map(([key, val]) => ({
          id: key,
          ...val
        })).sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        setMessages(msgs)
      } else {
        setMessages([])
      }
    })

    // Mark as read by admin
    set(ref(database, `chats/${selectedUserId}/info/unreadByAdmin`), false)

    return () => unsubscribe()
  }, [selectedUserId])

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendReply = async () => {
    if (!replyText.trim() || !selectedUserId || sending) return
    setSending(true)

    const msgsRef = ref(database, `chats/${selectedUserId}/messages`)
    await push(msgsRef, {
      text: replyText.trim(),
      sender: 'admin',
      userName: 'PMC Support',
      timestamp: Date.now(),
    })

    // Update conversation preview
    set(ref(database, `chats/${selectedUserId}/info/lastMessage`), replyText.trim().substring(0, 60))
    set(ref(database, `chats/${selectedUserId}/info/lastMessageTime`), Date.now())

    setReplyText('')
    setSending(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendReply()
    }
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    const now = new Date()
    const isToday = date.toDateString() === now.toDateString()
    if (isToday) return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const selectedConvo = conversations.find(c => c.userId === selectedUserId)

  return (
    <div className="admin-chat-container">

      {/* Sidebar - Conversations list */}
      <div className="admin-chat-sidebar">
        <div className="admin-chat-sidebar-header">
          <FaInbox className="me-2" /> Conversations
          {conversations.filter(c => c.unreadByAdmin).length > 0 && (
            <span className="admin-chat-unread-total">
              {conversations.filter(c => c.unreadByAdmin).length}
            </span>
          )}
        </div>

        {conversations.length === 0 ? (
          <div className="admin-chat-empty-sidebar">
            <FaCommentDots size={28} style={{ color: '#333', marginBottom: '8px' }} />
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="admin-chat-list">
            {conversations.map(convo => (
              <div
                key={convo.userId}
                className={`admin-chat-item ${selectedUserId === convo.userId ? 'active' : ''}`}
                onClick={() => setSelectedUserId(convo.userId)}
              >
                <div className="admin-chat-item-avatar">
                  <FaUser size={14} />
                </div>
                <div className="admin-chat-item-info">
                  <div className="admin-chat-item-name">
                    {convo.userName || 'Unknown Player'}
                    {convo.unreadByAdmin && <FaCircle className="admin-unread-dot" />}
                  </div>
                  <div className="admin-chat-item-preview">
                    {convo.lastMessage || 'No messages yet'}
                  </div>
                </div>
                <div className="admin-chat-item-time">
                  {formatTime(convo.lastMessageTime)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main chat area */}
      <div className="admin-chat-main">
        {!selectedUserId ? (
          <div className="admin-chat-placeholder">
            <FaCommentDots size={40} style={{ color: '#222', marginBottom: '12px' }} />
            <p>Select a conversation to start replying</p>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div className="admin-chat-main-header">
              <div className="admin-chat-user-avatar"><FaUser size={16} /></div>
              <div>
                <div className="admin-chat-user-name">{selectedConvo?.userName || 'Unknown'}</div>
                <div className="admin-chat-user-meta">
                  ID: {selectedUserId?.substring(0, 20)}...
                  {selectedConvo?.page && ` · Viewing: ${selectedConvo.page}`}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="admin-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`admin-msg-wrap ${msg.sender === 'admin' ? 'admin-msg-right' : 'admin-msg-left'}`}
                >
                  {msg.sender === 'user' && (
                    <div className="admin-msg-label">{msg.userName}</div>
                  )}
                  <div className={`admin-msg-bubble ${msg.sender === 'admin' ? 'admin-msg-bubble-admin' : 'admin-msg-bubble-user'}`}>
                    {msg.text}
                  </div>
                  <div className={`admin-msg-time ${msg.sender === 'admin' ? 'text-end' : ''}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply input */}
            <div className="admin-chat-input-area">
              <input
                type="text"
                className="admin-chat-input"
                placeholder={`Reply to ${selectedConvo?.userName || 'user'}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={handleKeyDown}
                maxLength={500}
                autoFocus
              />
              <button
                className="admin-chat-send-btn"
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
              >
                <FaPaperPlane size={14} /> Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminChat