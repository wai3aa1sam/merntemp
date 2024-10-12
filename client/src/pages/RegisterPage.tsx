import axios from "axios";
import React, { FormEvent, useState } from 'react'
import { Link } from "react-router-dom"

type RegisterProps =
{   
    name        : string;
    email       : string;
    password    : string;
};  

const RegisterPage = () => {

    const [name,        setName]       = useState("");
    const [email,       setEmail]      = useState("");
    const [password,    setPassword]   = useState("");

    async function registerUser(ev : FormEvent<HTMLFormElement>)
    {
        ev.preventDefault();
        try
        {
            let prop : RegisterProps = 
            {
                name        : name,
                email       : email,
                password    : password,
            };
            await axios.post("/register", prop);
        }
        catch (e)
        {
            alert("registration failed.");
        }
    }

    return (
        <div className = "mt-4 grow flex items-center justify-around">   {/* css_note: always center when screen change */}   
            <div className = "mb-64">
                <h1 className = "text-4xl text-center mb-4">Register</h1>
                <form className = "max-w-md mx-auto" onSubmit={registerUser}>
                    <input  type = "text"        placeholder = {"name"}  
                            value = {name} 
                            onChange = {ev => setName(ev.target.value)} 
                    />
                    <input  type = "email"       placeholder = {"your@email.com"}
                            value = {email} 
                            onChange = {ev => setEmail(ev.target.value)} 
                    />
                    <input  type = "password"    placeholder = {"password"}
                            value = {password} 
                            onChange = {ev => setPassword(ev.target.value)} 
                    />
                    <button className = "primary">Register</button>

                    <div className = "text-center py-2 text-gray-500">
                        <Link to = {"/login"} className = "underline text-bn" >Already a member?</Link>
                    </div>

                </form>
            </div>
            
        </div>
        )
}

export default RegisterPage
