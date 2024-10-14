
import express, { Response } from 'express';
import cors from "cors";
import {ProjectSettings, EnvVariables, HttpErrorCode} from "./mnt_api_config"
import mongoose, { ObjectId } from "mongoose";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import CookieParser from "cookie-parser"

import {UserModel, UserInfo, UserToken} from "./model/User"

//const port = mnt.ProjectSetting.instance.port;
const port : number = ProjectSettings.instance.port;
const bcryptSalt    = bcrypt.genSaltSync();
const jwtSecret     = "bcrypt.genSaltSync()";

const loginCookieName = "token";

const app   = express();
const cors_ = cors(
    {
        credentials : true, 
        origin      : "http://localhost:5173"
    });

app.use(cors_);
app.use(express.json());
app.use(CookieParser());

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
            const {name, email, _id} = await UserModel.findById((userData as UserToken).id) as UserInfo;
            resp.json({name, email, _id});
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

function onConnectServer() 
{
    console.log(`apiDataBaseUrl: ${EnvVariables.instance.apiDataBaseUrl}`);
    console.log(`running at ${ProjectSettings.instance.serverUrl}`);
}
app.listen(port, onConnectServer);