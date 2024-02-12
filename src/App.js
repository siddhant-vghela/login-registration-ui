import React, { useState } from 'react'
import Login from './Login'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './Home'
import { GoogleOAuthProvider } from '@react-oauth/google'
import SignUp from './SignUp'

const App = () => {
    return (
        <>
            <BrowserRouter>
                <GoogleOAuthProvider
                    clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                >
                    <Routes>
                        <Route exact path="/Login" element={<Login />} />
                        <Route exact path="/" element={<Home />}></Route>
                        <Route
                            exact
                            path="/signUp"
                            element={<SignUp />}
                        ></Route>
                    </Routes>
                </GoogleOAuthProvider>
            </BrowserRouter>
        </>
    )
}

export default App
