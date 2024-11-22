import React from 'react'
import { Route, Routes } from "react-router-dom"
import { Entry } from '../pages/Entry'
import { NotFound } from '../pages/NotFound'
import { Chats } from '../pages/Chats'
import { PrivateRoute } from './PrivateRoute'



const AppRoutes = props => {

  return (
    <Routes>
      <Route path='/' element={<Entry />}></Route>
      <Route path='*' element={<NotFound />}></Route>
      <Route element={<PrivateRoute />}>
        <Route path='/chats' element={<Chats />}></Route>
      </Route>
    </Routes >
  )
}



export default AppRoutes
