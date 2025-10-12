import React from 'react'
import { useAuthStore } from '../store/useAuthStore'

const ChatPage = () => {
  const{logOut}=useAuthStore()
  return (
    <div className='z-10'>
      <button onClick={logOut} className='z-10'>logOut</button>
    </div>
    
  )
}

export default ChatPage