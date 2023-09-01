import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Home from '../pages/frontend/Home'
import Register from './auth/Register/Register';
import Login from './auth/Login/Login';
import PrivateRoute from '../PrivateRoute/PrivateRoute';
import { useAuth } from '../contexts/AuthContext';

export default function Routing() {
    const { user } = useAuth
    return (
        <>
            <Routes >
                <Route path="/" element={<Login />} />
                <Route path="/Register" element={<Register />} />
                <Route path="/Home" element={<PrivateRoute Component={Home} />} />
            </Routes>
        </>
    )
}
