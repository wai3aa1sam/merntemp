import { ProjectSettings } from "../mnt_core";

class PlaceData
{
    _id        ?: any;
    title       : string    = "";
    address     : string    = "";
    photos      : string[]  = [];
    description : string    = "";
    price       : Number    = 0;

    public srcImg(index : number = 0) : string 
    { 
        if (index < 0 || index >= this.photos.length) 
            {
            throw new Error("Invalid photo index");
        }
        return ProjectSettings.instance.serverUploadPhotoUrl + "/" + this.photos[index]; 
    }
};

export
{
    PlaceData
}