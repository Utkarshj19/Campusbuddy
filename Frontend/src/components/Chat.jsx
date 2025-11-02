import React, { useState } from 'react'


export default function Chat({ userId, apiBase }) {
const [input, setInput] = useState('')
const [messages, setMessages] = useState([])
const [loading, setLoading] = useState(false)


async function send() {
if (!input.trim()) return
const userMsg = { role: 'user', text: input }
setMessages(m => [...m, userMsg])
setLoading(true)


try {
const res = await fetch(`${apiBase.replace(/\/$/, '')}/ask`, {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ userId, message: input })
})
const data = await res.json()
const botMsg = { role: 'bot', text: data.reply }
setMessages(m => [...m, botMsg])
} catch (e) {
setMessages(m => [...m, { role: 'bot', text: 'Error: could not reach server' }])
} finally {
setLoading(false)
setInput('')
}
}


return (
<div className="chat">
<div className="messages">
{messages.map((m, i) => (
<div key={i} className={m.role === 'user' ? 'msg user' : 'msg bot'}>
<div>{m.text}</div>
</div>
))}
</div>


<div className="composer">
<input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask Campus Buddy..." onKeyDown={e => e.key === 'Enter' && send()} />
<button onClick={send} disabled={loading}>{loading ? '...' : 'Send'}</button>
</div>
</div>
)
}