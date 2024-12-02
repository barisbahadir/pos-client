import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

// eslint-disable-next-line react/prop-types
const ProtectedRoute = ({ children }) => {
  const token = useSelector((state) => state.token)

  // authToken undefined ise hatayı önlemek için kontrol ekleyin
  if (token === undefined || !token) {
    return <Navigate to="/login" replace />
  }

  return token ? children : <Navigate to="/login" />
}

export default ProtectedRoute
