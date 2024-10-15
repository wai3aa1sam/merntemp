import React, { FormEvent, useState } from 'react'
import { preInput } from "../component/InputDom"
import { PlaceData } from "../../../core/interop/PlaceInterop";
import axios from "axios";
import PhotoUploader from "../component/PhotoUploader";
import AccountNav from "./AccountNav";
import { Navigate } from "react-router-dom";

const PlacesFormPage = () => {
    
    const [title,           setTitle]           = useState("");
    const [address,         setAddress]         = useState("");
    const [description,     setDescription]     = useState("");
    const [addedPhotos,     setAddedPhotos]     = useState([]);
    
    const [redirect,        setRedirect]        = useState(false);

    async function addNewPlace(ev : FormEvent)
    {
        ev.preventDefault();
        if (!title)
        {
            alert("title must not empty");
            return;
        }
        const placeData : PlaceData = { title : title, address : address, addedPhotos : addedPhotos, description : description };
        const {resp} = await axios.post("/places", placeData);
        setRedirect(true);
    }

    if (redirect)
    {
        return <Navigate to = {"/account/places"} />;
    }
    
    return (
        <div>
            <AccountNav></AccountNav>
            <form onSubmit = {addNewPlace}>
                {preInput("Title", "title for your place, should be short and catchy as in advertisement")}
                <input type = "text" value = {title} onChange = { ev => setTitle(ev.target.value) } placeholder = "title, for example: My apartment"/>

                {preInput("Address", "address to this place")}
                <input type = "text" value = {address} onChange = { ev => setAddress(ev.target.value) } placeholder = "address"/>
                
                <PhotoUploader addedPhotos = {addedPhotos} onAddPhoto = {setAddedPhotos} ></PhotoUploader>

                {preInput("Description", "description of the place")}
                <textarea value = {description} onChange = { ev => setDescription(ev.target.value) } />

                <div>
                    <button className = "primary my-4">Save</button>
                </div>

            </form>
        </div>
    )
}

export default PlacesFormPage
