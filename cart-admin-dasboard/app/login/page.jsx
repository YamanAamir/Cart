import AuthLogin from '@/components/Auth/Login/AuthLogin'
import GuestRoute from '@/contexts/GuestRoute'
import React from 'react'

function Login() {
  return (
   <GuestRoute>
    <AuthLogin />
   </GuestRoute>
  )
}

export default Login