import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'

export default function PrivateRoute({ Component }) {
    const { user } = useAuth()
    const location = useLocation()

    // if (user) {
    //     return <Navigate to='/' state={{ from: location.pathname }} replace />
    // }
    return (
        <Component />
    )
}
