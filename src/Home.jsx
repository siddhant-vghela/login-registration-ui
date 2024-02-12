import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { googleLogout } from '@react-oauth/google'
import axios from 'axios'

const Home = () => {
    const navigate = useNavigate()

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            navigate('login')
        }
    }, [])

    const logout = async () => {
        try {
            const token = localStorage.getItem('token')

            if (token) {
                await axios.post(
                    `${process.env.REACT_APP_API_HOST}/api/signout`,
                    null,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    },
                )

                localStorage.removeItem('token')
                alert('Sign-out successful')
                navigate('/login')
            } else {
                console.error('Token not found in localStorage')
            }
        } catch (error) {
            console.error('Logout failed:', error)
        }
    }

    return (
        <>
            <h2>Wellcome </h2>
            <Link to="/login">Login</Link>
            <button onClick={logout}>Logout</button>
            {/* <GoogleLogout
                clientId={CLIENT_ID}
                buttonText="Logout"
                onLogoutSuccess={this.logout}
                onFailure={this.handleLogoutFailure}
            ></GoogleLogout> */}
        </>
    )
}

export default Home
