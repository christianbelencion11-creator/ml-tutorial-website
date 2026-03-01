import React, { useState, useEffect, useRef } from 'react'
import { database } from '../firebase'
import { ref, onValue, push, set, remove } from 'firebase/database'
import { FaCommentDots, FaPaperPlane, FaUser, FaCircle, FaInbox, FaTrash, FaCheckCircle } from 'react-icons/fa'

function AdminChat() {
  const [conversations, setConversations] = useState([])
  const [selectedUserId, setSelectedUserId] = useState(null)
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const inputRef = useRef(null)

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
        const msgs = Object.entries(data).map(([key, val]) => ({ id: key, ...val }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        setMessages(msgs)
      } else {
        setMessages([])
      }
    })
    set(ref(database, `chats/${selectedUserId}/info/unreadByAdmin`), false)
    return () => unsubscribe()
  }, [selectedUserId])

  // ✅ SCROLL FIX - scroll only the messages container, never the page
  const messagesContainerRef = useRef(null)
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight
    }
  }, [messages])

  // ✅ Keep focus on input after sending
  useEffect(() => {
    if (!sending && inputRef.current && selectedUserId) {
      inputRef.current.focus()
    }
  }, [sending, selectedUserId])

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
    set(ref(database, `chats/${selectedUserId}/info/lastMessage`), replyText.trim().substring(0, 60))
    set(ref(database, `chats/${selectedUserId}/info/lastMessageTime`), Date.now())
    setReplyText('')
    setSending(false)
  }

  const deleteConversation = async (userId) => {
    if (!confirm('Delete this conversation?')) return
    await remove(ref(database, `chats/${userId}`))
    if (selectedUserId === userId) {
      setSelectedUserId(null)
      setMessages([])
    }
  }

  const formatTime = (ts) => {
    if (!ts) return ''
    const date = new Date(ts)
    const now = new Date()
    if (date.toDateString() === now.toDateString())
      return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    return date.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const selectedConvo = conversations.find(c => c.userId === selectedUserId)
  const totalUnread = conversations.filter(c => c.unreadByAdmin).length

  return (
    <div className="ac-container" style={{ height: "100%", borderRadius: 0, border: "none", borderTop: "1px solid #141414" }}>

      {/* ===== SIDEBAR ===== */}
      <div className="ac-sidebar">
        <div className="ac-sidebar-header">
          <div className="ac-sidebar-title">
            <FaInbox size={12} /> CONVERSATIONS
            {totalUnread > 0 && <span className="ac-badge-count">{totalUnread}</span>}
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="ac-sidebar-empty">
            <FaCommentDots size={28} style={{ marginBottom: '8px' }} />
            <p>No conversations yet</p>
          </div>
        ) : (
          <div className="ac-convo-list">
            {conversations.map(convo => (
              <div
                key={convo.userId}
                className={`ac-convo-item ${selectedUserId === convo.userId ? 'active' : ''}`}
                onClick={() => setSelectedUserId(convo.userId)}
              >
                <div className="ac-convo-avatar"><FaUser size={12} /></div>
                <div className="ac-convo-info">
                  <div className="ac-convo-name">
                    {convo.userName || 'Unknown Player'}
                    {convo.unreadByAdmin && <FaCircle className="ac-unread-dot" />}
                  </div>
                  <div className="ac-convo-preview">{convo.lastMessage || 'No messages'}</div>
                </div>
                <div className="ac-convo-meta">
                  <div className="ac-convo-time">{formatTime(convo.lastMessageTime)}</div>
                  <button
                    className="ac-delete-btn"
                    onClick={(e) => { e.stopPropagation(); deleteConversation(convo.userId) }}
                    title="Delete"
                  >
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ===== MAIN CHAT ===== */}
      <div className="ac-main">
        {!selectedUserId ? (
          <div className="ac-placeholder">
            <FaCommentDots size={38} style={{ marginBottom: '12px' }} />
            <p>Select a conversation</p>
            <small style={{ color: '#1e1e1e', fontSize: '0.75rem', marginTop: '4px' }}>to start replying</small>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="ac-chat-header">
              <div className="ac-chat-avatar"><FaUser size={15} /></div>
              <div className="ac-chat-info">
                <div className="ac-chat-name">{selectedConvo?.userName || 'Unknown'}</div>
                <div className="ac-chat-meta">
                  {selectedConvo?.page ? `Viewing: ${selectedConvo.page}` : 'PMC Gaming Chat'}
                </div>
              </div>
              <div className="ac-chat-header-actions">
                <button
                  className="ac-resolve-btn"
                  onClick={() => deleteConversation(selectedUserId)}
                >
                  <FaCheckCircle size={12} /> Resolve
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="ac-messages" ref={messagesContainerRef}>
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', color: '#2a2a2a', fontSize: '0.8rem', marginTop: '20px' }}>
                  No messages yet
                </div>
              )}
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ac-msg-wrap ${msg.sender === 'admin' ? 'ac-msg-right' : 'ac-msg-left'}`}
                >
                  {msg.sender === 'user' && (
                    <div className="ac-msg-label">{msg.userName}</div>
                  )}
                  <div className={`ac-bubble ${msg.sender === 'admin' ? 'ac-bubble-admin' : 'ac-bubble-user'}`}>
                    {msg.type === 'image' && msg.imageUrl ? (
                      <img
                        src={msg.imageUrl}
                        alt="uploaded"
                        className="ac-img-preview"
                        onClick={() => window.open(msg.imageUrl, '_blank')}
                      />
                    ) : msg.text}
                  </div>
                  <div className={`ac-time ${msg.sender === 'admin' ? 'ac-time-right' : ''}`}>
                    {formatTime(msg.timestamp)}
                  </div>
                </div>
              ))}

            </div>

            {/* Input */}
            <div className="ac-input-area">
              <input
                ref={inputRef}
                type="text"
                className="ac-input"
                placeholder={`Reply to ${selectedConvo?.userName || 'user'}...`}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    sendReply()
                  }
                }}
                maxLength={500}
              />
              <button
                className="ac-send-btn"
                onClick={sendReply}
                disabled={!replyText.trim() || sending}
              >
                <FaPaperPlane size={13} /> Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default AdminChat