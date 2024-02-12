import React, { useState, useEffect } from 'react'
import './Loginpage.css'
import { GoogleLogin } from '@react-oauth/google'
import { useNavigate, Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios'

const Googlel = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ username: '', password: '' })

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        })
    }

    const isValidEmail = (email) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return emailPattern.test(email)
    }

    const validateForm = () => {
        const formElements = ['username', 'password']

        let isValid = true

        formElements.forEach(function (elementId) {
            const inputElement = document.getElementById(elementId)
            const inputValue = inputElement.value

            if (inputValue === '') {
                setErrorMsg(inputElement, `${elementId} can't be blank...`)
                isValid = false
            } else {
                if (elementId === 'username') {
                    if (isNaN(inputValue) && !isValidEmail(inputValue)) {
                        setErrorMsg(inputElement, 'Invalid email format...')
                        isValid = false
                    } else if (!isNaN(inputValue) && inputValue.length !== 10) {
                        setErrorMsg(inputElement, 'Invalid number format...')
                        isValid = false
                    } else {
                        setSuccessfulMsg(inputElement)
                    }
                } else if (elementId === 'password' && inputValue.length <= 2) {
                    setErrorMsg(
                        inputElement,
                        `${elementId} must be at least 3 characters...`,
                    )
                    isValid = false
                } else {
                    setSuccessfulMsg(inputElement)
                }
            }
        })

        const { username, password } = formData

        if (
            (!isValidEmail(username) &&
                (username.length !== 10 || isNaN(username))) ||
            password === ''
        ) {
            isValid = false
        } else {
            console.log(username, ' = ', username)
            console.log('password', ' = ', password)
        }

        return isValid
    }

    const setErrorMsg = (input, msg) => {
        const all = input.parentElement
        const small = all.querySelector('.error-msg')
        all.classList.add('error')
        all.classList.remove('success')
        small.innerText = msg
    }

    const setSuccessfulMsg = (input) => {
        const all = input.parentElement
        all.classList.remove('error')
        all.classList.add('success')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!validateForm()) return

        try {
            let payload = {}

            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/signin`,
                {
                    identifier: formData.username,
                    password: formData.password,
                },
            )

            if (response.data.error) {
                alert(`Login failed: ${response.data.error}`)
            } else {
                const token = response.data.token

                localStorage.setItem('token', token)
                alert('Login successful!')

                navigate('/')
            }
        } catch (error) {
            alert('Login failed. Please check your credentials.')
        }
    }

    const handleGoogleLoginSuccess = async (googleUser) => {
        const credentialResponseDecoded = jwtDecode(googleUser.credential)
        const googleId = credentialResponseDecoded.sub
        console.log(credentialResponseDecoded)

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/signin`,
                {
                    googleId: googleId,
                },
            )

            if (response.status === 200) {
                console.log('Login successful:', response.data)

                const token = response.data.token

                localStorage.setItem('token', token)

                window.location.href = '/'
            } else {
                console.log('Login failed:', response.data)
            }
        } catch (error) {
            console.error('Error calling API:', error)
        }
    }

    const responseGoogleFailure = (response) => {
        console.log('Google Login Failure:', response)
    }
    return (
        <div className="form-container">
            <div className="header">
                <h2>Login</h2>
            </div>
            <form className="formtext" onSubmit={handleSubmit}>
                {/* Email Input */}
                <div className="all">
                    <label htmlFor="username">Mobile /Email:</label>
                    <input
                        type="text"
                        name="username"
                        className={`border ${
                            formData.username.length > 0 ? 'success' : ''
                        }`}
                        id="username"
                        placeholder="Enter the mobile/email..."
                        value={formData.username}
                        onChange={handleChange}
                    />
                    <small className="error-msg">Email can't be blank...</small>
                </div>
                {/* Password Input */}
                <div className="all">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        name="password"
                        className={`border ${
                            formData.password.length > 0 ? 'success' : ''
                        }`}
                        id="password"
                        placeholder="Enter the password..."
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <small className="error-msg">
                        Password can't be blank...
                    </small>
                </div>
                {/* Forgot Password and Sign-up Links */}
                <div className="forgot-password">
                    <a href="#">Forgot Password?</a>
                    <Link to="/signUp">Sign up</Link>
                </div>
                {/* Submit Button */}
                <input
                    type="submit"
                    className="btn-sign border"
                    value="Log in"
                />
                {/* Google Sign-in */}
                <div className="google-sign">
                    <GoogleLogin
                        className="google-sign-btn"
                        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
                        buttonText="Login  with Google"
                        onSuccess={handleGoogleLoginSuccess}
                        onFailure={responseGoogleFailure}
                        cookiePolicy={'single_host_origin'}
                        apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                    />
                </div>
            </form>
        </div>
    )
}

export default Googlel
