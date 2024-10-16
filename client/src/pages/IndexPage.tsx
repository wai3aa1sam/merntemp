import { Link } from "react-router-dom";
import Header from "../Header";
import { useEffect, useState } from "react";
import axios from "axios";
import { PlaceData } from "../../../core/interop/PlaceInterop";
import { ProjectSettings } from "../mnt_client_config";

export default function IndexPage()
{
    const [places, setPlaces] = useState<PlaceData[]>([]);
    useEffect(() =>
    {
        axios.get("/places").then(
            resp => 
            {
                const data = resp.data;
                setPlaces([...data]);
            }
        );
    }, []);

    return (
        <div className = "mt-8 grid gap-x-6 gap-y-8 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {
                places.length > 0 
                &&
                places.map((place, idx) =>
                (
                    <div key = {place._id}>
                        <div className = "bg-gray-500 mb-2 rounded-2xl flex">
                            {
                                place.photos?.[0] 
                                &&
                                (
                                    <img className = "rounded-2xl object-cover aspect-square" src = {ProjectSettings.instance.serverUploadPhotoUrl + "/" + place.photos[0]} alt = ""></img>
                                )
                            }
                        </div>
                        <h3 className = "font-bold">                   {place.address}</h3>
                        <h2 className = "text-sm text-gray-500">     {place.title}</h2>

                    </div>
                ))
            }
        </div>
    );
}