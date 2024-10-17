
import express, { Express } from 'express';
import cors from "cors";
import {ProjectSettings, EnvVariables, HttpErrorCode} from "./mnt_api_config"
import mongoose, { ObjectId } from "mongoose";
import bcrypt from "bcryptjs"
import CookieParser from "cookie-parser"
import fs from "fs"

import { mwLogger } from "./middleware/MwLogger"
import { mwErrorHandler } from "./middleware/mwErrorHandler"
import { UserController } from "./controller/UserController";
import { Controller } from "./controller/Controller";
import { PlaceController } from "./controller/PlaceController";

class Server
{
    publicRoot   : string = "";

    run()
    {
        this.create();
    }

    private create()
    {
        this.publicRoot        = __dirname + "/..";

        const app = express();

        //const port = mnt.ProjectSetting.instance.port;
        const port : number = ProjectSettings.instance.port;
        const bcryptSalt    = bcrypt.genSaltSync();
        const jwtSecret     = "bcrypt.genSaltSync()";

        const loginCookieName = "token";

        const uploadPhotoRoot  = this.uploadPhotoRoot;
        if (!fs.existsSync(uploadPhotoRoot))
        {
            fs.mkdirSync(uploadPhotoRoot, { recursive: true });
        }

        this.createMiddleware(app);

        mongoose.connect(EnvVariables.instance.apiDataBaseUrl);

        Controller.init(bcryptSalt, jwtSecret, loginCookieName);
        UserController.commit(app);
        PlaceController.commit(app, uploadPhotoRoot);

        function onConnectServer() 
        {
            console.log(`apiDataBaseUrl: ${EnvVariables.instance.apiDataBaseUrl}`);
            console.log(`running at ${ProjectSettings.instance.serverUrl}`);
        }
        app.listen(port, onConnectServer);
    }

    private createMiddleware(app : Express)
    {
        const cors_ = cors(
            {
                credentials : true, 
                origin      : "http://localhost:5173"
            });

        app.use(mwLogger);
        app.use(cors_);
        app.use(express.json());
        app.use(CookieParser());
        app.use(express.static(this.publicRoot));
        app.use(`/${ProjectSettings.instance.uploadPhotoDir}`, express.static(this.uploadPhotoRoot));
        //app.use(`/upload`, express.static(uploadPhotoRoot));

        app.use(mwErrorHandler);
    }

    get uploadPhotoRoot()   : string    { return `${this.publicRoot}/${ProjectSettings.instance.uploadPhotoDir}`; }
}

export 
{
    Server
}