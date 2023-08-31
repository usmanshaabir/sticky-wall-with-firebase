import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import Home from '../pages/frontend/Home'

export default function Routing() {
    return (
        <>
            <Routes >
                <Route path="/" element={<Login />} />
                <Route path="Home" element={<Home />} />
            </Routes>
        </>
    )
}
