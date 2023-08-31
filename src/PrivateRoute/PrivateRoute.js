import React from 'react'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute() {
    const { user } = useAuth()

    return (
        <div>

        </div>
    )
}
