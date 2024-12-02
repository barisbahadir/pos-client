import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.token)

  // authToken undefined ise hatayı önlemek için kontrol ekleyin
  if (token === undefined) {
    console.error('authToken is undefined. Ensure AuthProvider is configured properly.')
    return <Navigate to="/login" />
  }

  return token ? children : <Navigate to="/login" />
}

export default ProtectedRoute
