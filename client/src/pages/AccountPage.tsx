import React, { useContext, useState } from 'react'
import { UserCotext } from "../context/UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";

enum AccountSubPageType
{
    None = 0,
}


const AccountPage = () => {

    const {isReady, user, setUser}          = useContext(UserCotext);
    const [redirect, setRedirect]           = useState(null);
    let   {subpage}                         = useParams();
    
    if (subpage === undefined)
    {
        subpage = "profile"
    }

    if (!isReady)
    {
        return "Loading...";
    }

    if (isReady && !user && !redirect)
    {
        return <Navigate to = {"/login"} />;
    }

    async function logout()
    {
        await axios.post("/logout");
        setRedirect("/");
        setUser(null);
    }

    function linkClasses(type : string) : string
    {
        let style = "py-2 px-6 ";
        if (type == subpage)
        {
            style += "bg-primary text-white rounded-full ";
        }
        return style;
    }

    if (redirect)
    {
        return <Navigate to = {redirect}/>;
    }

    return (
        <div>
            <nav className = "w-full flex justify-center mt-8 gap-2 mb-8">
                <Link to = {"/account"}             className = {linkClasses("profile")}   >My profile</Link>
                <Link to = {"/account/bookings"}    className = {linkClasses("bookings")}  >My bookings</Link>
                <Link to = {"/account/places"}      className = {linkClasses("places")}    >My accommodations</Link>
            </nav>
            {
                subpage === "profile" 
                && (
                    <div className = "text-center max-w-lg mx-auto">
                        Logged in as {user.name} ({user.email})<br />
                        <button onClick = {logout} className = "primary max-w-sm mt-2">Logout</button>
                    </div>
                )
            }
        </div>
    )
}

export default AccountPage
