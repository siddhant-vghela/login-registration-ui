import React, { useState } from 'react'
import './Loginpage.css'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

const SignUpg = () => {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        email: '',
        number: '',
        password: '',
    })

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
        const formElements = ['email', 'number', 'password']

        let isValid = true

        formElements.forEach(function (elementId) {
            const inputElement = document.getElementById(elementId)
            const inputValue = inputElement.value

            if (inputValue === '') {
                setErrorMsg(inputElement, `${elementId} can't be blank...`)
                isValid = false
            } else if (elementId === 'email' && !isValidEmail(inputValue)) {
                setErrorMsg(inputElement, 'Invalid email format...')
                isValid = false
            } else if (elementId === 'number' && inputValue.length !== 10) {
                setErrorMsg(inputElement, 'Invalid number format...')
                isValid = false
            } else if (inputValue.length <= 2) {
                setErrorMsg(
                    inputElement,
                    `${elementId} must be at least 3 characters...`,
                )
                isValid = false
            } else {
                setSuccessfulMsg(inputElement)
            }
        })

        const { email, number, password } = formData

        if (
            !isValidEmail(email) ||
            number.length !== 10 ||
            isNaN(number) ||
            password === ''
        ) {
            isValid = false
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

        console.log('userData:', formData)
        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/register`,
                {
                    email: formData.email,
                    number: formData.number,
                    password: formData.password,
                    name: formData.name ? formData.name : 'default name',
                },
            )

            console.log('Registration successful:', response.data)
            alert('Registration successful!')
        } catch (error) {
            console.error('Registration failed:', error.message)
            alert('Registration failed. Please try again.')
        }
    }

    const handleGoogleLoginSuccess = async (googleUser) => {
        const credentialResponseDecoded = jwtDecode(googleUser.credential)
        const googleId = credentialResponseDecoded.sub
        const email = credentialResponseDecoded.email
        const name = credentialResponseDecoded.name
        console.log(googleId)
        console.log(email)
        console.log(name)

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_HOST}/api/register`,
                {
                    email: email,
                    name: name,
                    googleId: googleId,
                },
            )

            console.log('Registration successful:', response.data)
            alert('Registration successful!')
            handleGoogleLoginSuccess()
        } catch (error) {
            console.error('Registration failed:', error.message)
            alert('Registration failed. Please try again.')
        }
    }

    const responseGoogleFailure = (response) => {
        console.log('Google Login Failure:', response)
    }
    return (
        <div className="form-container">
            <div className="header">
                <h2>Sign up</h2>
            </div>
            <form className="formtext" onSubmit={handleSubmit}>
                <div className="all">
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        name="email"
                        className={`border ${
                            formData.email.length > 0 ? 'success' : ''
                        }`}
                        id="email"
                        placeholder="Enter the email..."
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <small className="error-msg">Email can't be blank...</small>
                </div>
                <div className="all">
                    <label htmlFor="number">Mobile:</label>
                    <input
                        type="number"
                        name="number"
                        className={`border ${
                            formData.number.length > 0 ? 'success' : ''
                        }`}
                        id="number"
                        placeholder="Enter the mobile number..."
                        value={formData.number}
                        onChange={handleChange}
                    />
                    <small className="error-msg">
                        Number can't be blank...
                    </small>
                </div>
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
                <div className="forgot-password">
                    <a href="#">Forgot Password?</a>
                </div>
                <input
                    type="submit"
                    className="btn-sign border"
                    value="Sign in"
                />
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

export default SignUpg
