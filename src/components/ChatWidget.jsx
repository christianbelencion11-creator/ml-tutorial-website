import React, { useState, useEffect, useRef, useCallback } from 'react'
import { database, storage } from '../firebase'
import { ref, push, onValue, set, remove } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { FaCommentDots, FaTimes, FaPaperPlane, FaShieldAlt, FaImage, FaCheckCircle, FaCircle } from 'react-icons/fa'

function getUserIdentity() {
  let userId = localStorage.getItem('pmc_chat_user_id')
  let userName = localStorage.getItem('pmc_chat_user_name')
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6)
    userName = `Player #${Math.floor(Math.random() * 9000) + 1000}`
    localStorage.setItem('pmc_chat_user_id', userId)
    localStorage.setItem('pmc_chat_user_name', userName)
  }
  return { userId, userName }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [sending, setSending] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [showEndConfirm, setShowEndConfirm] = useState(false)
  const [ended, setEnded] = useState(false)

  // Drag
  const [pos, setPos] = useState({ x: window.innerWidth - 72, y: window.innerHeight - 72 })
  const [dragging, setDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ mx: 0, my: 0, px: 0, py: 0 })
  const [moved, setMoved] = useState(false)

  const messagesRef = useRef(null)
  const inputRef = useRef(null)
  const fileInputRef = useRef(null)
  const btnRef = useRef(null)
  const { userId, userName } = getUserIdentity()

  // Load saved pos
  useEffect(() => {
    const saved = localStorage.getItem('pmc_bubble_pos')
    if (saved) {
      try { setPos(JSON.parse(saved)) } catch {}
    }
  }, [])

  // ── Drag ──────────────────────────────────────────────
  const startDrag = useCallback((mx, my) => {
    setDragging(true)
    setMoved(false)
    setDragStart({ mx, my, px: pos.x, py: pos.y })
  }, [pos])

  useEffect(() => {
    if (!dragging) return
    const move = (mx, my) => {
      const dx = mx - dragStart.mx
      const dy = my - dragStart.my
      if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setMoved(true)
      const nx = Math.min(Math.max(28, dragStart.px + dx), window.innerWidth - 28)
      const ny = Math.min(Math.max(28, dragStart.py + dy), window.innerHeight - 28)
      setPos({ x: nx, y: ny })
    }
    const onMM = (e) => move(e.clientX, e.clientY)
    const onTM = (e) => { e.preventDefault(); move(e.touches[0].clientX, e.touches[0].clientY) }
    const onUp = () => {
      setDragging(false)
      setPos(p => { localStorage.setItem('pmc_bubble_pos', JSON.stringify(p)); return p })
    }
    window.addEventListener('mousemove', onMM)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTM, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMM)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTM)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragging, dragStart])

  // ── Messages ──────────────────────────────────────────
  useEffect(() => {
    const unsubscribe = onValue(ref(database, `chats/${userId}/messages`), (snap) => {
      const data = snap.val()
      if (data) {
        const msgs = Object.entries(data)
          .map(([k, v]) => ({ id: k, ...v }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        setMessages(msgs)
        const seen = parseInt(localStorage.getItem('pmc_last_seen') || '0')
        const unread = msgs.filter(m => m.sender === 'admin' && (m.timestamp || 0) > seen).length
        setUnreadCount(unread)
      } else {
        setMessages([])
        setUnreadCount(0)
      }
    })
    return () => unsubscribe()
  }, [userId])

  // ── Auto scroll ───────────────────────────────────────
  useEffect(() => {
    if (isOpen && messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, isOpen])

  // ── Open/close side effects ───────────────────────────
  useEffect(() => {
    if (isOpen) {
      const ts = Date.now()
      localStorage.setItem('pmc_last_seen', ts.toString())
      setUnreadCount(0)
      set(ref(database, `chats/${userId}/info`), {
        userName, userId, lastSeen: ts, page: window.location.pathname, status: 'open'
      })
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen, userId, userName])

  // ── Listen for contact form ───────────────────────────
  useEffect(() => {
    const handler = (e) => {
      setIsOpen(true)
      if (e.detail?.message) setInputText(e.detail.message)
    }
    window.addEventListener('pmc_open_chat', handler)
    return () => window.removeEventListener('pmc_open_chat', handler)
  }, [])

  // ── Send ──────────────────────────────────────────────
  const sendMessage = async () => {
    if (!inputText.trim() || sending) return
    setSending(true)
    const text = inputText.trim()
    setInputText('')
    await push(ref(database, `chats/${userId}/messages`), {
      text, sender: 'user', userName, timestamp: Date.now(), type: 'text'
    })
    set(ref(database, `chats/${userId}/info`), {
      userName, userId, lastMessage: text.substring(0, 60),
      lastMessageTime: Date.now(), unreadByAdmin: true,
      page: window.location.pathname, status: 'open'
    })
    setSending(false)
  }

  const handleImage = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) { alert('Max 5MB'); return }
    setUploadingImage(true)
    try {
      const path = `chat-images/${userId}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const r = storageRef(storage, path)
      await uploadBytes(r, file, { contentType: file.type })
      const url = await getDownloadURL(r)
      await push(ref(database, `chats/${userId}/messages`), {
        text: '📷 Image', sender: 'user', userName,
        timestamp: Date.now(), type: 'image', imageUrl: url
      })
      set(ref(database, `chats/${userId}/info`), {
        userName, userId, lastMessage: '📷 Image',
        lastMessageTime: Date.now(), unreadByAdmin: true,
        page: window.location.pathname, status: 'open'
      })
    } catch (err) { alert('Upload failed. Check Firebase Storage rules.') }
    setUploadingImage(false)
    e.target.value = ''
  }

  const endConvo = async () => {
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
  }

  const fmtTime = (ts) => ts ? new Date(ts).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : ''

  // Chat window: always bottom-right of bubble, but stays on screen
  const W = Math.min(360, window.innerWidth - 16)
  const H = 500
  const GAP = 12
  const chatLeft = Math.min(Math.max(8, pos.x - W + 28), window.innerWidth - W - 8)
  const chatTop = Math.max(8, pos.y - H - 56 - GAP)

  return (
    <>
      {/* ── Chat Window ───────────────────────── */}
      {isOpen && (
        <div style={{
          position: 'fixed', left: chatLeft, top: chatTop,
          width: W, height: H, zIndex: 9997,
          display: 'flex', flexDirection: 'column',
          background: '#0a0a0a',
          border: '1px solid #1e1e1e',
          borderRadius: '16px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.95), 0 0 0 1px rgba(255,0,0,0.08)',
          overflow: 'hidden',
          animation: 'cwPop .22s cubic-bezier(.34,1.56,.64,1)',
        }}>

          {/* Header */}
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', background:'#0d0d0d', borderBottom:'1px solid #141414', flexShrink:0 }}>
            <div style={{ width:36, height:36, background:'#1a0000', border:'2px solid #ff0000', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#ff0000', flexShrink:0, position:'relative' }}>
              <FaShieldAlt size={14} />
              <span style={{ position:'absolute', bottom:1, right:1, width:9, height:9, background:'#22c55e', borderRadius:'50%', border:'2px solid #0d0d0d' }} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'0.88rem', fontWeight:700, color:'#fff' }}>PMC Support</div>
              <div style={{ fontSize:'0.68rem', color:'#555', display:'flex', alignItems:'center', gap:4 }}>
                <FaCircle size={6} style={{ color:'#22c55e' }} /> Online
              </div>
            </div>
            <button onClick={() => setShowEndConfirm(true)} style={{ background:'transparent', border:'1px solid #1e1e1e', color:'#444', fontSize:'0.65rem', fontWeight:700, letterSpacing:1, padding:'4px 8px', borderRadius:4, cursor:'pointer', transition:'all .2s', fontFamily:'Courier New' }}
              onMouseOver={e=>{ e.target.style.borderColor='#ff4444'; e.target.style.color='#ff4444' }}
              onMouseOut={e=>{ e.target.style.borderColor='#1e1e1e'; e.target.style.color='#444' }}>
              END
            </button>
            <button onClick={() => setIsOpen(false)} style={{ background:'transparent', border:'none', color:'#444', cursor:'pointer', padding:4, display:'flex', transition:'color .2s' }}
              onMouseOver={e=>e.currentTarget.style.color='#ff0000'}
              onMouseOut={e=>e.currentTarget.style.color='#444'}>
              <FaTimes size={14} />
            </button>
          </div>

          {/* End confirm */}
          {showEndConfirm && (
            <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.88)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:10, padding:20 }}>
              <div style={{ background:'#0f0f0f', border:'1px solid #ff0000', borderRadius:14, padding:'28px 24px', textAlign:'center', maxWidth:260 }}>
                <p style={{ color:'#fff', fontWeight:700, marginBottom:6 }}>End this conversation?</p>
                <p style={{ color:'#444', fontSize:'0.78rem', marginBottom:20, fontFamily:'Courier New' }}>All messages will be deleted.</p>
                <div style={{ display:'flex', gap:8 }}>
                  <button onClick={endConvo} style={{ flex:1, background:'#ff0000', border:'none', color:'#fff', padding:9, borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:'0.82rem' }}>Yes, End</button>
                  <button onClick={() => setShowEndConfirm(false)} style={{ flex:1, background:'transparent', border:'1px solid #222', color:'#666', padding:9, borderRadius:8, fontWeight:700, cursor:'pointer', fontSize:'0.82rem' }}>Cancel</button>
                </div>
              </div>
            </div>
          )}

          {ended ? (
            <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#555', gap:10 }}>
              <FaCheckCircle size={36} style={{ color:'#22c55e' }} />
              <p style={{ color:'#fff', fontWeight:700, margin:0 }}>Conversation ended!</p>
              <small style={{ fontFamily:'Courier New', fontSize:'0.75rem' }}>Thanks for chatting 🎮</small>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div ref={messagesRef} style={{ flex:1, overflowY:'auto', padding:'14px 12px', display:'flex', flexDirection:'column', gap:6, scrollbarWidth:'thin', scrollbarColor:'#1a1a1a transparent', overscrollBehavior:'contain' }}>
                <div style={{ background:'rgba(255,0,0,0.04)', border:'1px solid rgba(255,0,0,0.08)', borderRadius:10, padding:'10px 12px', textAlign:'center', fontSize:'0.74rem', color:'#555', marginBottom:4, lineHeight:1.6 }}>
                  Welcome, <strong style={{ color:'#ff4444' }}>{userName}</strong>! Ask us anything about MLBB 🎮
                </div>

                {messages.map((msg, idx) => {
                  const isUser = msg.sender === 'user'
                  const prevMsg = messages[idx - 1]
                  const showName = !isUser && (!prevMsg || prevMsg.sender !== 'admin')
                  return (
                    <div key={msg.id} style={{ display:'flex', flexDirection:'column', alignItems: isUser ? 'flex-end' : 'flex-start', gap:2 }}>
                      {showName && <div style={{ fontSize:'0.66rem', color:'#ff4444', fontWeight:700, marginLeft:4, letterSpacing:0.5 }}>PMC Support</div>}
                      <div style={{
                        maxWidth:'80%', padding:'9px 13px', borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isUser ? '#ff0000' : '#161616',
                        color: isUser ? '#fff' : '#ccc',
                        border: isUser ? 'none' : '1px solid #222',
                        fontSize:'0.85rem', lineHeight:1.55, wordBreak:'break-word',
                      }}>
                        {msg.type === 'image' && msg.imageUrl
                          ? <img src={msg.imageUrl} alt="" style={{ maxWidth:160, maxHeight:160, borderRadius:8, cursor:'pointer', display:'block' }} onClick={() => window.open(msg.imageUrl, '_blank')} />
                          : msg.text}
                      </div>
                      <div style={{ fontSize:'0.62rem', color:'#2a2a2a', marginTop:1, display:'flex', alignItems:'center', gap:3, flexDirection: isUser ? 'row-reverse' : 'row' }}>
                        {fmtTime(msg.timestamp)}
                        {isUser && <span style={{ color:'#22c55e', fontSize:'0.7rem' }}>✓✓</span>}
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Input */}
              <div style={{ display:'flex', alignItems:'center', gap:7, padding:'10px 12px', background:'#0d0d0d', borderTop:'1px solid #111', flexShrink:0 }}>
                <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImage} style={{ display:'none' }} />
                <button onClick={() => fileInputRef.current?.click()} disabled={uploadingImage}
                  style={{ width:34, height:34, background:'transparent', border:'1px solid #1e1e1e', borderRadius:'50%', color:'#444', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}
                  onMouseOver={e=>{ e.currentTarget.style.borderColor='#ff0000'; e.currentTarget.style.color='#ff0000' }}
                  onMouseOut={e=>{ e.currentTarget.style.borderColor='#1e1e1e'; e.currentTarget.style.color='#444' }}>
                  {uploadingImage ? <span style={{ width:14, height:14, border:'2px solid #ff0000', borderTopColor:'transparent', borderRadius:'50%', display:'inline-block', animation:'cwSpin .6s linear infinite' }} /> : <FaImage size={13} />}
                </button>
                <input
                  ref={inputRef} type="text" value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); sendMessage() } }}
                  placeholder="Type a message..."
                  maxLength={500}
                  style={{ flex:1, background:'#111', border:'1px solid #1a1a1a', borderRadius:24, color:'#ddd', padding:'9px 16px', fontSize:'0.85rem', outline:'none', fontFamily:'system-ui,sans-serif', transition:'border-color .2s' }}
                  onFocus={e => e.target.style.borderColor='#ff0000'}
                  onBlur={e => e.target.style.borderColor='#1a1a1a'}
                />
                <button onClick={sendMessage} disabled={!inputText.trim() || sending}
                  style={{ width:36, height:36, background: inputText.trim() ? '#ff0000' : '#1a1a1a', border:'none', borderRadius:'50%', color: inputText.trim() ? '#fff' : '#333', cursor: inputText.trim() ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
                  <FaPaperPlane size={13} />
                </button>
              </div>
              <div style={{ padding:'5px', textAlign:'center', fontSize:'0.62rem', color:'#1e1e1e', background:'#0d0d0d', letterSpacing:1 }}>
                Chatting as <strong style={{ color:'#2a2a2a' }}>{userName}</strong>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Bubble Toggle ─────────────────────── */}
      <div ref={btnRef}
        onMouseDown={e => { e.preventDefault(); startDrag(e.clientX, e.clientY) }}
        onTouchStart={e => startDrag(e.touches[0].clientX, e.touches[0].clientY)}
        onClick={() => { if (!moved) setIsOpen(o => !o) }}
        style={{
          position:'fixed', left: pos.x, top: pos.y,
          transform:'translate(-50%,-50%)',
          width:56, height:56, borderRadius:'50%',
          background: isOpen ? '#333' : '#ff0000',
          color:'#fff', border:'none', cursor: dragging ? 'grabbing' : 'grab',
          display:'flex', alignItems:'center', justifyContent:'center',
          zIndex:9999,
          boxShadow: dragging ? '0 8px 32px rgba(255,0,0,0.9)' : '0 4px 20px rgba(255,0,0,0.6)',
          transition: dragging ? 'none' : 'background .2s, box-shadow .2s',
          userSelect:'none', touchAction:'none',
        }}>
        {isOpen ? <FaTimes size={20} /> : <FaCommentDots size={20} />}
        {!isOpen && unreadCount > 0 && (
          <span style={{ position:'absolute', top:-4, right:-4, background:'#fff', color:'#ff0000', borderRadius:'50%', width:20, height:20, fontSize:'0.65rem', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #ff0000' }}>
            {unreadCount}
          </span>
        )}
      </div>

      <style>{`
        @keyframes cwPop { from { opacity:0; transform:scale(.92) translateY(12px); } to { opacity:1; transform:scale(1) translateY(0); } }
        @keyframes cwSpin { to { transform:rotate(360deg); } }
      `}</style>
    </>
  )
}