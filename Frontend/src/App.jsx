import React, { useState } from 'react'
import Chat from './components/Chat'


export default function App() {
const [userId] = useState(() => 'user-' + Math.random().toString(36).slice(2,9));


return (
<div className="container">
<h1>Campus Buddy</h1>
<p className="muted">Your GenAI college assistant</p>
<Chat userId={userId} apiBase={import.meta.env.VITE_API_BASE || 'http://localhost:5000'} />
</div>
)
}