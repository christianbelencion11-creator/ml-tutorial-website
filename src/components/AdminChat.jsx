import React, { useState, useEffect, useRef } from 'react'
import { database } from '../firebase'
import { ref, onValue, push, set, remove } from 'firebase/database'
import { FaPaperPlane, FaUser, FaCircle, FaInbox, FaTrash, FaCheckCircle, FaShieldAlt } from 'react-icons/fa'

export default function AdminChat() {
  const [conversations, setConversations] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [messages, setMessages] = useState([])
  const [replyText, setReplyText] = useState('')
  const [sending, setSending] = useState(false)
  const msgsRef = useRef(null)
  const inputRef = useRef(null)

  // All conversations
  useEffect(() => {
    const unsubscribe = onValue(ref(database, 'chats/'), (snap) => {
      const data = snap.val()
      if (data) {
        const list = Object.entries(data).map(([id, val]) => ({
          userId: id, ...val.info, hasMessages: !!val.messages
        })).sort((a, b) => (b.lastMessageTime || 0) - (a.lastMessageTime || 0))
        setConversations(list)
      } else {
        setConversations([])
      }
    })
    return () => unsubscribe()
  }, [])

  // Selected conversation messages
  useEffect(() => {
    if (!selectedId) return
    const unsubscribe = onValue(ref(database, `chats/${selectedId}/messages`), (snap) => {
      const data = snap.val()
      if (data) {
        const msgs = Object.entries(data)
          .map(([k, v]) => ({ id: k, ...v }))
          .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
        setMessages(msgs)
      } else {
        setMessages([])
      }
    })
    set(ref(database, `chats/${selectedId}/info/unreadByAdmin`), false)
    return () => unsubscribe()
  }, [selectedId])

  // Scroll only messages container — never page
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight
    }
  }, [messages])

  const send = async () => {
    if (!replyText.trim() || !selectedId || sending) return
    setSending(true)
    const text = replyText.trim()
    setReplyText('')
    await push(ref(database, `chats/${selectedId}/messages`), {
      text, sender: 'admin', userName: 'PMC Support', timestamp: Date.now(), type: 'text'
    })
    await set(ref(database, `chats/${selectedId}/info/lastMessage`), text.substring(0, 60))
    await set(ref(database, `chats/${selectedId}/info/lastMessageTime`), Date.now())
    setSending(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  const deleteConvo = async (id) => {
    if (!confirm('Delete this conversation?')) return
    await remove(ref(database, `chats/${id}`))
    if (selectedId === id) { setSelectedId(null); setMessages([]) }
  }

  const fmtTime = (ts) => {
    if (!ts) return ''
    const d = new Date(ts), now = new Date()
    if (d.toDateString() === now.toDateString())
      return d.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' })
    return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const selected = conversations.find(c => c.userId === selectedId)
  const totalUnread = conversations.filter(c => c.unreadByAdmin).length

  return (
    <div style={{ display:'flex', height:'calc(100vh - 160px)', minHeight:500, background:'#060606', borderRadius:0, overflow:'hidden', fontFamily:'system-ui,sans-serif' }}>

      {/* ── Sidebar ───────────────────────────── */}
      <div style={{ width:280, flexShrink:0, borderRight:'1px solid #0f0f0f', display:'flex', flexDirection:'column', background:'#080808' }}>
        {/* Sidebar header */}
        <div style={{ padding:'14px 16px', borderBottom:'1px solid #0f0f0f', display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
          <FaInbox size={12} style={{ color:'#ff0000' }} />
          <span style={{ fontSize:'0.72rem', fontWeight:900, letterSpacing:2.5, color:'#ff0000', flex:1 }}>CONVERSATIONS</span>
          {totalUnread > 0 && (
            <span style={{ background:'#ff0000', color:'#fff', borderRadius:10, padding:'1px 7px', fontSize:'0.65rem', fontWeight:900 }}>{totalUnread}</span>
          )}
        </div>

        {conversations.length === 0 ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#2a2a2a', fontSize:'0.8rem', gap:8 }}>
            <FaInbox size={28} />
            <p style={{ margin:0 }}>No conversations yet</p>
          </div>
        ) : (
          <div style={{ flex:1, overflowY:'auto', scrollbarWidth:'thin', scrollbarColor:'#1a1a1a transparent' }}>
            {conversations.map(c => (
              <div key={c.userId}
                onClick={() => setSelectedId(c.userId)}
                style={{
                  display:'flex', alignItems:'center', gap:10, padding:'12px 14px',
                  cursor:'pointer', borderBottom:'1px solid #0a0a0a',
                  background: selectedId === c.userId ? '#120000' : 'transparent',
                  borderRight: selectedId === c.userId ? '3px solid #ff0000' : '3px solid transparent',
                  transition:'background .15s',
                }}>
                {/* Avatar */}
                <div style={{ width:36, height:36, background: c.unreadByAdmin ? '#1a0000' : '#0f0f0f', borderRadius:'50%', border:`1px solid ${c.unreadByAdmin ? '#ff0000' : '#1e1e1e'}`, display:'flex', alignItems:'center', justifyContent:'center', color: c.unreadByAdmin ? '#ff0000' : '#333', flexShrink:0 }}>
                  <FaUser size={12} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:'0.83rem', fontWeight:700, color: c.unreadByAdmin ? '#fff' : '#888', display:'flex', alignItems:'center', gap:5 }}>
                    {c.userName || 'Unknown'}
                    {c.unreadByAdmin && <FaCircle size={6} style={{ color:'#ff0000' }} />}
                  </div>
                  <div style={{ fontSize:'0.72rem', color:'#2a2a2a', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', marginTop:2, fontFamily:'Courier New' }}>
                    {c.lastMessage || 'No messages'}
                  </div>
                </div>
                <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:5, flexShrink:0 }}>
                  <div style={{ fontSize:'0.62rem', color:'#1e1e1e' }}>{fmtTime(c.lastMessageTime)}</div>
                  <button onClick={e => { e.stopPropagation(); deleteConvo(c.userId) }}
                    style={{ background:'transparent', border:'none', color:'#1e1e1e', cursor:'pointer', padding:2, transition:'color .2s' }}
                    onMouseOver={e => e.currentTarget.style.color='#ff4444'}
                    onMouseOut={e => e.currentTarget.style.color='#1e1e1e'}>
                    <FaTrash size={10} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Main Chat ─────────────────────────── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, background:'#080808' }}>
        {!selectedId ? (
          <div style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', color:'#1e1e1e', gap:8 }}>
            <FaInbox size={40} />
            <p style={{ margin:0, fontSize:'0.85rem' }}>Select a conversation</p>
            <small style={{ fontSize:'0.72rem', color:'#141414' }}>to start replying</small>
          </div>
        ) : (
          <>
            {/* Chat header */}
            <div style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 18px', background:'#0a0a0a', borderBottom:'1px solid #0f0f0f', flexShrink:0 }}>
              <div style={{ width:38, height:38, background:'#1a0000', border:'1px solid #ff0000', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#ff0000', flexShrink:0, position:'relative' }}>
                <FaUser size={14} />
                <span style={{ position:'absolute', bottom:1, right:1, width:9, height:9, background:'#22c55e', borderRadius:'50%', border:'2px solid #0a0a0a' }} />
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'0.9rem', fontWeight:700, color:'#fff' }}>{selected?.userName || 'Unknown'}</div>
                <div style={{ fontSize:'0.68rem', color:'#333', fontFamily:'Courier New', marginTop:2 }}>
                  {selected?.page || '/chat'} · {fmtTime(selected?.lastMessageTime)}
                </div>
              </div>
              <button onClick={() => deleteConvo(selectedId)}
                style={{ display:'flex', alignItems:'center', gap:6, background:'transparent', border:'1px solid #1e1e1e', color:'#444', borderRadius:6, padding:'5px 12px', fontSize:'0.72rem', fontWeight:700, letterSpacing:1, cursor:'pointer', fontFamily:'Courier New', transition:'all .2s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='#22c55e'; e.currentTarget.style.color='#22c55e' }}
                onMouseOut={e => { e.currentTarget.style.borderColor='#1e1e1e'; e.currentTarget.style.color='#444' }}>
                <FaCheckCircle size={11} /> Resolve
              </button>
            </div>

            {/* Messages */}
            <div ref={msgsRef} style={{ flex:1, overflowY:'auto', padding:'16px 18px', display:'flex', flexDirection:'column', gap:6, scrollbarWidth:'thin', scrollbarColor:'#1a1a1a transparent', overscrollBehavior:'contain' }}>
              {messages.length === 0 && (
                <div style={{ textAlign:'center', color:'#1e1e1e', fontSize:'0.8rem', marginTop:40 }}>No messages yet</div>
              )}
              {messages.map((msg, idx) => {
                const isAdmin = msg.sender === 'admin'
                const prev = messages[idx - 1]
                const showLabel = !prev || prev.sender !== msg.sender
                return (
                  <div key={msg.id} style={{ display:'flex', flexDirection:'column', alignItems: isAdmin ? 'flex-end' : 'flex-start', gap:2 }}>
                    {showLabel && (
                      <div style={{ fontSize:'0.65rem', color: isAdmin ? '#ff4444' : '#444', fontWeight:700, marginBottom:1, letterSpacing:0.5, padding: isAdmin ? '0 4px' : '0 40px 0 4px' }}>
                        {isAdmin ? 'You (PMC Support)' : msg.userName}
                      </div>
                    )}
                    <div style={{ display:'flex', alignItems:'flex-end', gap:8, flexDirection: isAdmin ? 'row-reverse' : 'row' }}>
                      {!isAdmin && (
                        <div style={{ width:28, height:28, background:'#0f0f0f', borderRadius:'50%', border:'1px solid #1e1e1e', display:'flex', alignItems:'center', justifyContent:'center', color:'#333', flexShrink:0 }}>
                          <FaUser size={10} />
                        </div>
                      )}
                      {isAdmin && (
                        <div style={{ width:28, height:28, background:'#1a0000', borderRadius:'50%', border:'1px solid #ff0000', display:'flex', alignItems:'center', justifyContent:'center', color:'#ff0000', flexShrink:0 }}>
                          <FaShieldAlt size={10} />
                        </div>
                      )}
                      <div style={{
                        maxWidth:'70%', padding:'9px 13px',
                        borderRadius: isAdmin ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        background: isAdmin ? '#ff0000' : '#111',
                        color: isAdmin ? '#fff' : '#ccc',
                        border: isAdmin ? 'none' : '1px solid #1e1e1e',
                        fontSize:'0.86rem', lineHeight:1.55, wordBreak:'break-word',
                      }}>
                        {msg.type === 'image' && msg.imageUrl
                          ? <img src={msg.imageUrl} alt="" style={{ maxWidth:200, maxHeight:200, borderRadius:8, cursor:'pointer', display:'block' }} onClick={() => window.open(msg.imageUrl, '_blank')} />
                          : msg.text}
                      </div>
                    </div>
                    <div style={{ fontSize:'0.62rem', color:'#1e1e1e', padding: isAdmin ? '0 36px 0 0' : '0 0 0 36px', display:'flex', alignItems:'center', gap:3, flexDirection: isAdmin ? 'row-reverse' : 'row' }}>
                      {fmtTime(msg.timestamp)}
                      {isAdmin && <span style={{ color:'#22c55e' }}>✓✓</span>}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Input */}
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'#0a0a0a', borderTop:'1px solid #0f0f0f', flexShrink:0 }}>
              <input
                ref={inputRef} type="text" value={replyText}
                onChange={e => setReplyText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); e.stopPropagation(); send() } }}
                placeholder={`Reply to ${selected?.userName || 'user'}...`}
                maxLength={500}
                style={{ flex:1, background:'#111', border:'1px solid #1a1a1a', borderRadius:24, color:'#ddd', padding:'10px 18px', fontSize:'0.88rem', outline:'none', fontFamily:'system-ui,sans-serif', transition:'border-color .2s' }}
                onFocus={e => e.target.style.borderColor='#ff0000'}
                onBlur={e => e.target.style.borderColor='#1a1a1a'}
              />
              <button onClick={send} disabled={!replyText.trim() || sending}
                style={{ width:42, height:42, background: replyText.trim() ? '#ff0000' : '#1a1a1a', border:'none', borderRadius:'50%', color: replyText.trim() ? '#fff' : '#333', cursor: replyText.trim() ? 'pointer' : 'not-allowed', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all .2s' }}>
                <FaPaperPlane size={14} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}