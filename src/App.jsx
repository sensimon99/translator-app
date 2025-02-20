import React from 'react'
import './App.css'
import Sidebar from './components/sidebar/Sidebar'
import ChatArea from './components/chatarea/ChatArea'

const App = () => {
  return (
    <div>
      <Sidebar />
      <ChatArea />
    </div>
  )
}

export default App