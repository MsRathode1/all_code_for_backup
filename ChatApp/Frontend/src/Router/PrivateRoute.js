import React from 'react'
import { Route, Routes, Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'

export const PrivateRoute = () => {
    const store = useSelector((store) => store.user.userDetails)
    const auth = { token: store.token }
    if (!auth.token) {
        return <Navigate to={"/"} />
    }
    return (
        <Outlet />
    )
}
