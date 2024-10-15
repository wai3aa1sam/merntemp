import React, { useContext, useState } from 'react'
import { UserCotext } from "../context/UserContext"
import { Link, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import PlacesPage from "./PlacesPage";
import AccountNav from "./AccountNav";


const ProfilePage = () => {

    const {isReady, user, setUser}          = useContext(UserCotext);
    const [redirect, setRedirect]           = useState(null);
    let   {subpage}                         = useParams();
    
    async function logout()
    {
        await axios.post("/logout");
        setRedirect("/");
        setUser(null);
    }

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


    if (redirect)
    {
        return <Navigate to = {redirect}/>;
    }

    return (
        <div>
            <AccountNav></AccountNav>
            {
                subpage === "profile" 
                && (
                    <div className = "text-center max-w-lg mx-auto">
                        Logged in as {user.name} ({user.email})<br />
                        <button onClick = {logout} className = "primary max-w-sm mt-2">Logout</button>
                    </div>
                )
            }
            {/* {
                subpage === "places"
                && (
                    <PlacesPage></PlacesPage>
                )
            } */}
        </div>
    )
}

export default ProfilePage
