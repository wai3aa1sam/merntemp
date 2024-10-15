import mongoose from "mongoose";
import { PlaceData } from "../../../core/interop/PlaceInterop"

type ObjectId = mongoose.Schema.Types.ObjectId;

class PlaceInfo // extends mongoose.Document
{
    owner       ?: ObjectId;
    title       ?: string;
    address     ?: string;
    photos      ?: string[];
    description ?: string;
    perks       ?: string[];
    extraInfo   ?: string;
    checkIn     ?: Number;
    checkOut    ?: Number;
    maxGuests   ?: Number;

    constructor(id : ObjectId, data : PlaceData)
    {
        this.owner = id;
        this.title          = data.title;
        this.address        = data.address;
        this.description    = data.description;
        this.photos         = data.addedPhotos;
    }
};

const placeSchema = new mongoose.Schema<PlaceInfo>(
    {
        owner       : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
        title       : String,
        address     : String,
        photos      : [String],
        description : String,
        perks       : [String],
        extraInfo   : String,
        checkIn     : Number,
        checkOut    : Number,
        maxGuests   : Number,
    }
);

const PlaceModel = mongoose.model<PlaceInfo>("Place", placeSchema);

export 
{
    PlaceModel
    , PlaceInfo
}