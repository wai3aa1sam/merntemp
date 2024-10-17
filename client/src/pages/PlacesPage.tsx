import axios from "axios";
import React, { FormEvent, useEffect, useState } from 'react'
import { Link, Navigate, useParams } from "react-router-dom"
import { PlaceData } from "../../../core/interop/PlaceInterop"
import AccountNav from "./AccountNav";
import { ProjectSettings } from "../mnt_client_config";

const PlacesPage = () => {

    const [places, setPlaces] = useState<PlaceData[]>([]);

    const descMaxDisplay = 750;

    useEffect(() =>
    {
        axios.get("/user-places").then(
            (resp) =>
            {
                /*
                as PlaceData wont make it as PlaceData type, it also is a Object
                use this https://github.com/typestack/class-transformer
                */
                const placeData = resp.data;
                setPlaces(placeData);
            }
        );
    }, []);

    return (
        <div>
            <AccountNav></AccountNav>
            <div className = "text-center">
                <Link to = {"/account/places/new"} className = "inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add new place
                </Link>
            </div>
            <div className = "mt-4">
                {places?.length > 0 && places.map(
                    (place, i) =>
                    (
                        <Link to = {"/account/places/" + place._id} key = {place._id} className = "flex cursor-pointer gap-4 bg-gray-100 p-2 rounded-2xl">
                             <div className = "flex size-40 bg-gray-200 shrink-0 rounded-2xl">
                                {
                                    place.photos && place.photos.length > 0 
                                    && 
                                    (
                                        <img className = "rounded-2xl object-cover aspect-square" src = {ProjectSettings.instance.serverUploadPhotoUrl + "/" + place.photos[0]} alt = ""></img>
                                    )        
                                }
                            </div>

                            
                            <div className = "grow-0 shrink">
                                <h2 className = "text-xl">{place.title}</h2>
                                <p className = "text-sm mt-2">
                                    {
                                        (place.description.length <= descMaxDisplay) ?
                                            place.description 
                                            : `${place.description.slice(0, descMaxDisplay)}...`
                                    }
                                </p>
                            </div>
                        </Link>
                    )
                )}
            </div>
        </div>
  )
}

export default PlacesPage
