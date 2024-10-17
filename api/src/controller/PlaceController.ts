import express, { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import ImageDownloader from "image-downloader"

import {ProjectSettings, EnvVariables, HttpErrorCode} from "../mnt_api_config"
import { Controller } from "./Controller";
import { PlaceData } from "../../../core/interop/PlaceInterop";
import { PlaceData_make, PlaceInfo, PlaceModel } from "../model/Place";
import { UserToken } from "../model/User";

class PlaceController extends Controller
{
    static uploadPhotoRoot : string = "";

    static commit(app : Express, uploadPhotoRoot : string)
    {
        this.uploadPhotoRoot = uploadPhotoRoot;

        app.post("/upload-by-link",     PlaceController.uploadPhotoByLink);
        app.post("/places",             PlaceController.addNewPlace);
        app.get( "/user-places",        PlaceController.getUserPlaces);
        app.put( "/places",             PlaceController.editPlace);
        app.get( "/places",             PlaceController.getPlaces);
        app.get( "/places/:id",         PlaceController.getPlace);
    }

    static async uploadPhotoByLink(req : Request, resp : Response)
    {
        const {link} = req.body;

        const newName   : string = "photo_" + Date.now() + ".jpg";
        const filename  : string = PlaceController.uploadPhotoRoot + "/" + newName;
    
        try
        {
            if (!link)
                throw "null link";
    
            await ImageDownloader.image(
                {
                    url     : link,
                    dest    : filename,
                }
            );
            /*
                https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1000&h=563&crop=1
            */
            resp.json(newName);
        }
        catch (e)
        {
            resp.status(HttpErrorCode.UnprocessableEntity).json("invalid url: " + link);
        }
    }

    static async addNewPlace(req : Request, resp : Response)
    {
        const {token} = req.cookies;
        const placeData : PlaceData = req.body;
        
        jwt.verify(token, Controller.jwtSecret, {}, async (err, userData) =>
            {
                if (err) throw err;
                let userToken = userData as UserToken;
                let placeInfo = new PlaceInfo(placeData, userToken.id);
                const placeDoc = await PlaceModel.create(placeInfo);
                resp.json(placeDoc);
            }
        );
    }

    static async getUserPlaces(req : Request, resp : Response)
    {
        const {token} = req.cookies;
        jwt.verify(token, Controller.jwtSecret, {}, async (err, userData) =>
        {
            if (err) throw err;
            const id = (userData as UserToken).id;
            
            const placeDoc = await PlaceModel.find({owner : id});
            resp.json(placeDoc);
        });
    }

    static async editPlace(req : Request, resp : Response)
    {
        const {token} = req.cookies;
        const placeData : PlaceData = req.body;
        //console.log(placeData.srcImg());
        
        jwt.verify(token, Controller.jwtSecret, {}, async (err, userData) =>
            {
                if (err) throw err;
                let userToken = userData as UserToken;

                const placeDoc = await PlaceModel.findById(placeData._id);

                // userToken.id.equals(placeDoc.owner) -> error : userToken.id.equals is not a function...
                if (placeDoc && userToken.id.toString() === placeDoc.owner?.toString())        
                {
                    let placeInfo = new PlaceInfo(placeData, userToken.id);
                    placeDoc.set(placeInfo);
                    await placeDoc.save();
                    resp.json("ok");
                }
            }
        );
    }

    static async getPlace(req : Request, resp : Response)
    {
        const {id} = req.params;
        const placeDoc = await PlaceModel.findById(id);
        //console.log(placeDoc?.photos);
        resp.json(placeDoc);
    }

    static async getPlaces(req : Request, resp : Response)
    {
        resp.json(await PlaceModel.find());
    }
};

export
{
    PlaceController
}

