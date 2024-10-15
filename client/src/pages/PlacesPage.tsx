import axios from "axios";
import React, { useState } from 'react'
import { Link, useParams } from "react-router-dom"
import { ProjectSettings } from "../mnt_client_config";

const PlacesPage = () => {

    const {action} = useParams();

    const [title,           setTitle]           = useState("");
    const [address,         setAddress]         = useState("");
    const [addedPhotos,     setAddedPhotos]     = useState([]);
    const [photoLink,       setPhotoLink]       = useState("");
    const [description,     setDescription]     = useState("");

    function inputHeader(text : string)
    {
        return <h2 className = "text-2xl mt-4">{text}</h2>;
    }

    function inputDescription(text : string)
    {
        return <p  className = "text-gray-500 text-sm">{text}</p>;
    }
    
    function preInput(header : string, desc : string)
    {
        return (
            <div>
                {inputHeader(header)}
                {inputDescription(desc)}
            </div>
        );
    }
    const serverUploadPhotoUrl = ProjectSettings.instance.serverUploadPhotoUrl;

    async function addPhotoByLink(ev : MouseEvent<HTMLButtonElement>)
    {
        ev.preventDefault();

        const {data : filename} = await axios.post("/upload-by-link", { link : photoLink });
        setAddedPhotos(photos => 
            { 
                return [...photos, filename];
            });
        setPhotoLink("");
    }

    return (
        <div>
            {
                action !== "new" &&
                (
                    <div className = "text-center">
                        <Link to = {"/account/places/new"} className = "inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Add new place
                        </Link>
                    </div>
                )
            }
            {
                action === "new" &&
                (
                    <div>
                        <form>
                            {preInput("Title", "title for your place, should be short and catchy as in advertisement")}
                            <input type = "text" value = {title} onChange = { ev => setTitle(ev.target.value) } placeholder = "title, for example: My apartment"/>

                            {preInput("Address", "address to this place")}
                            <input type = "text" value = {address} onChange = { ev => setAddress(ev.target.value) } placeholder = "address"/>
                            
                            <h2 className = "text-2xl mt-4">Photos</h2>
                            <p  className = "text-gray-500 text-sm">more = better</p>
                            <div className = "flex gap-2">
                                <input  type = "text" 
                                        value = {photoLink} 
                                        onChange = { ev => setPhotoLink(ev.target.value) } 
                                        placeholder = {"add using a link ... jpg"}>
                                </input>
                                <button onClick = {addPhotoByLink} className = "bg-gray-200 px-4 rounded-2xl">Add&nbsp;photo</button>
                            </div>

                            <div className = "mt-2 grid gap-2 grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                {addedPhotos.length > 0 && addedPhotos.map(
                                    (link, i) =>
                                    (
                                        <div key = {link}>
                                            <img className = "rounded-2xl" src = {`${serverUploadPhotoUrl}/${link}`}></img>
                                        </div>
                                    )
                                )}
                                <button className = "flex items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                                    </svg>
                                    Upload
                                </button>

                            </div>

                            {preInput("Description", "description of the place")}
                            <textarea value = {description} onChange = { ev => setDescription(ev.target.value) } />

                            <div>
                                <button className = "primary my-4">Save</button>
                            </div>

                        </form>
                    </div>
                )
            }
        </div>
  )
}

export default PlacesPage
