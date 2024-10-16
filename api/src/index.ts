
import express, { Response } from 'express';
import cors from "cors";
import {ProjectSettings, EnvVariables, HttpErrorCode} from "./mnt_api_config"
import mongoose, { ObjectId } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import CookieParser from "cookie-parser"
import ImageDownloader from "image-downloader"
import fs from "fs"

import {UserModel, UserInfo, UserToken} from "./model/User"
import { url } from "inspector";
import { PlaceData_make, PlaceInfo, PlaceModel } from "./model/Place";
import { PlaceData } from "../../core/interop/PlaceInterop"


//const port = mnt.ProjectSetting.instance.port;
const port : number = ProjectSettings.instance.port;
const bcryptSalt    = bcrypt.genSaltSync();
const jwtSecret     = "bcrypt.genSaltSync()";

const loginCookieName = "token";

const uploadPhotoRoot = __dirname + "/../" + ProjectSettings.instance.uploadPhotoDir;

const app   = express();
const cors_ = cors(
    {
        credentials : true, 
        origin      : "http://localhost:5173"
    });

app.use(cors_);
app.use(express.json());
app.use(CookieParser());
app.use(`/${ProjectSettings.instance.uploadPhotoDir}`, express.static(uploadPhotoRoot));
//app.use(`/upload`, express.static(uploadPhotoRoot));

if (!fs.existsSync(uploadPhotoRoot))
    {
    fs.mkdirSync(uploadPhotoRoot, { recursive: true });
}

mongoose.connect(EnvVariables.instance.apiDataBaseUrl);

app.get('/test', (req, resp) => 
{
    resp.json("test ok");
});

app.post("/register", async (req, resp) => 
{
    try
    {
        let userInfo : UserInfo = req.body;
        userInfo.password = bcrypt.hashSync(userInfo.password, bcryptSalt);
        const userDoc = await UserModel.create(userInfo);    
        resp.json(userDoc);
    }
    catch (e)
    {
        resp.status(HttpErrorCode.UnprocessableEntity).json(e);
    }
});

app.post("/login", async (req, resp) => 
{
    try
    {
        const {email, password} = req.body;
        const userDoc = await UserModel.findOne({email});
        if (userDoc)
        {
            const isPwOk = bcrypt.compareSync(password, userDoc.password);
            if (isPwOk)
            {
                let userToken : UserToken =
                {
                    email   : userDoc.email
                    , id    : userDoc._id
                };
                jwt.sign(userToken, jwtSecret, {}, 
                    (err, token) =>
                    {
                        if (err) throw err;
                        resp.cookie(loginCookieName, token).json(userDoc);
                    }
                );
            }
            else
            {
                resp.status(HttpErrorCode.UnprocessableEntity).json("incorrect password");
            }
        }
        else
        {
            resp.status(HttpErrorCode.UnprocessableEntity).json("not found user");
        }
    }
    catch (e)
    {
        resp.status(HttpErrorCode.UnprocessableEntity).json(e);
    }
});


app.get("/profile", (req, resp) =>
{
    const {token} = req.cookies;
    if (token)
    {
        jwt.verify(token, jwtSecret, {}, async (err, userData) =>
        {
            if (err) throw err;
            const user : UserInfo | null = await UserModel.findById((userData as UserToken).id);
            //const user = await UserModel.findById((userData as UserToken).id); // this get Document
            resp.json(user);
        });
    }
    else
    {
        resp.json(null);
    }
});

app.post("/logout", (req, resp) =>
{
    resp.cookie(loginCookieName, "").json(true);
});

app.post("/upload-by-link", async (req, resp) =>
{
    const {link} = req.body;

    const newName   : string = "photo_" + Date.now() + ".jpg";
    const filename  : string = uploadPhotoRoot + "/" + newName;

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
});

app.post("/places", (req, resp) =>
{
    const {token} = req.cookies;
    const placeData : PlaceData = req.body;
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) =>
        {
            if (err) throw err;
            let userToken = userData as UserToken;
            let placeInfo = new PlaceInfo(placeData, userToken.id);
            const placeDoc = await PlaceModel.create(placeInfo);
            resp.json(placeDoc);
        }
    );
});

app.get("/user-places", (req, resp) =>
{
    const {token} = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) =>
    {
        if (err) throw err;
        const id = (userData as UserToken).id;
        
        const placeDoc = await PlaceModel.find({owner : id});
        resp.json(placeDoc);
    });
});

app.get("/places/:id", async (req, resp) =>
{
    const {id} = req.params;
    const placeDoc = await PlaceModel.findById(id);
    //console.log(placeDoc?.photos);
    resp.json(placeDoc);
});

app.put("/places", async (req, resp) =>
{
    const {token} = req.cookies;
    const placeData : PlaceData = req.body;
    //console.log(placeData.srcImg());
    
    jwt.verify(token, jwtSecret, {}, async (err, userData) =>
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
});

app.get("/places", async (req, resp) =>
{
    resp.json(await PlaceModel.find());
});

function onConnectServer() 
{
    console.log(`apiDataBaseUrl: ${EnvVariables.instance.apiDataBaseUrl}`);
    console.log(`running at ${ProjectSettings.instance.serverUrl}`);
}
app.listen(port, onConnectServer);