import React, { FormEvent, useEffect, useState } from 'react'
import { preInput } from "../component/InputDom"
import { PlaceData } from "../../../core/interop/PlaceInterop";
import axios from "axios";
import PhotoUploader from "../component/PhotoUploader";
import AccountNav from "./AccountNav";
import { Navigate, useParams } from "react-router-dom";

const PlacesFormPage = () => {

    const {id} = useParams();
    
    const [title,           setTitle]           = useState("");
    const [address,         setAddress]         = useState("");
    const [description,     setDescription]     = useState("");
    const [addedPhotos,     setAddedPhotos]     = useState<string[]>([]);
    
    const [redirect,        setRedirect]        = useState(false);

    async function savePlace(ev : FormEvent)
    {
        ev.preventDefault();
        if (!title)
        {
            alert("title must not empty");
            return;
        }

        const isNewPlace : boolean = !id;
        let placeData : PlaceData = { title : title, address : address, photos : addedPhotos, description : description };

        if (isNewPlace)
        {
            const {resp} = await axios.post("/places", placeData);
        }
        else
        {
            placeData._id = id;
            const {resp} = await axios.put("/places", placeData); // { id, ...placeData }
        }
        
        setRedirect(true);
    }

    useEffect(() =>
    {
        if (!id)
        {
            return;
        }
        axios.get("/places/" + id)
             .then(
                (resp) =>
                {
                    const place = resp.data as PlaceData;
                    setTitle(place.title);
                    setAddress(place.address);
                    setAddedPhotos(place.photos);
                    setDescription(place.description);
                }
        );
    }, [id]);

    if (redirect)
    {
        return <Navigate to = {"/account/places"} />;
    }
    
    return (
        <div>
            <AccountNav></AccountNav>
            <form onSubmit = {savePlace}>
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
