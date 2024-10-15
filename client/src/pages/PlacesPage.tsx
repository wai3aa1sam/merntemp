import axios from "axios";
import React, { FormEvent, useState } from 'react'
import { Link, Navigate, useParams } from "react-router-dom"
import { PlaceData } from "../../../core/interop/PlaceInterop"
import PlacesFormPage from "./PlacesFormPage";
import AccountNav from "./AccountNav";

const PlacesPage = () => {

    // const {action} = useParams();

    // const [redirect,        setRedirect]        = useState(null);


    // if (redirect)
    // {
    //     return <Navigate to = {redirect} />;
    // }

    return (
        <div>
            <AccountNav></AccountNav>
            <div className = "text-center">
                list of all added places <br></br>

                <Link to = {"/account/places/new"} className = "inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add new place
                </Link>
            </div>
        </div>
  )
}

export default PlacesPage
