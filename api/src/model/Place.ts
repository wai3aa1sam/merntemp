import mongoose from "mongoose";
import { PlaceData } from "../../../core/interop/PlaceInterop"

type ObjectId = mongoose.Types.ObjectId;

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
    price       ?: Number;

    constructor(data : PlaceData, ownerId : ObjectId)
    {
        this.owner          = ownerId;
        this.title          = data.title;
        this.address        = data.address;
        this.description    = data.description;
        this.photos         = data.photos;
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

function PlaceData_make(v : any) : PlaceData
{
    let o = new PlaceData();
    o._id           = v._id;
    o.title         = v.title;
    o.address       = v.address;
    o.photos        = v.photos;
    o.description   = v.description;
    return o;
}

export 
{
    PlaceModel
    , PlaceInfo
    , PlaceData_make
}