import React, { useState } from 'react'
import { Link } from "react-router-dom"

const LoginPage = () => {
    
    const [email,       setEmail]       = useState("");
    const [password,    setPassword]    = useState("");

  return (
    <div className = "mt-4 grow flex items-center justify-around">   {/* css_note: always center when screen change */}   
        <div className = "mb-64">
            <h1 className = "text-4xl text-center mb-4">Login</h1>
            <form className = "max-w-md mx-auto">
                <input type = "email"       placeholder = {"your@email.com"}    value = {email}     onChange = {ev => setEmail(   ev.target.value)}/>
                <input type = "password"    placeholder = {"password"}          value = {password}  onChange = {ev => setPassword(ev.target.value)}/>
                <button className = "primary">Login</button>

                <div className = "text-center py-2 text-gray-500">
                    Don't have an account yet? <a> </a>
                    <Link to = {"/register"} className = "underline text-bn" >Register now</Link>
                </div>

            </form>
        </div>
        
    </div>
    )
}

export default LoginPage
