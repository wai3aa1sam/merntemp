import React, { useState } from 'react'
import { preInput } from "./InputDom"
import axios from "axios";
import { ProjectSettings } from "../mnt_client_config";

const PhotoUploader = ( { addedPhotos, onAddPhoto } ) => 
{
    const [photoLink,       setPhotoLink]       = useState("");
    
    const serverUploadPhotoUrl = ProjectSettings.instance.serverUploadPhotoUrl;
    
    async function addPhotoByLink(ev : React.MouseEvent<HTMLButtonElement>)
    {
        ev.preventDefault();

        const {data : filename} = await axios.post("/upload-by-link", { link : photoLink });
        onAddPhoto((photos : string[]) => 
            { 
                return [...photos, filename];
            });
        setPhotoLink("");
    }

    function uploadPhoto(ev : React.MouseEvent<HTMLButtonElement>)
    {
        ev.preventDefault();
        alert("not yet support");
    }

    return (
        <div>
            {preInput("Photos", "more = better")}
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
                <button onClick = {uploadPhoto} className = "flex items-center justify-center border bg-transparent rounded-2xl p-2 text-2xl text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z" />
                    </svg>
                    Upload
                </button>

            </div>

        </div>
    )
}

export default PhotoUploader
