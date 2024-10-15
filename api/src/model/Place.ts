import mongoose from "mongoose";

interface PlaceInfo extends mongoose.Document
{
    onwer       : number,
    title       : string,
    address     : string,
    photos      : [string],
    description : string,
    extraInfo   : string,
    checkIn     : Number,
    checkOut    : Number,
    maxGuests   : Number,
};

const placeSchema = new mongoose.Schema<PlaceInfo>(
    {
        onwer       : {type : mongoose.Schema.Types.ObjectId, ref : "User"},
        title       : String,
        address     : String,
        photos      : [String],
        description : String,
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