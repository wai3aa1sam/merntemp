
import express, { Response } from 'express';
import cors from "cors";
import {ProjectSettings, EnvVariables, HttpErrorCode} from "./mnt_api_config"
import mongoose from "mongoose";
import bcrypt from "bcryptjs"

import {UserModel, UserInfo} from "./model/User"

//const port = mnt.ProjectSetting.instance.port;
const port : number = ProjectSettings.instance.port;
const bcryptSalt    = bcrypt.genSaltSync();

const app   = express();
const cors_ = cors(
    {
        credentials : true, 
        origin      : "http://localhost:5173"
    });

app.use(cors_);
app.use(express.json());

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

function onConnectServer() 
{
    console.log(`apiDataBaseUrl: ${EnvVariables.instance.apiDataBaseUrl}`);
    console.log(`running at ${ProjectSettings.instance.serverUrl}`);
}
app.listen(port, onConnectServer);