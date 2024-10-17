import express, { Express, Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

import {ProjectSettings, EnvVariables, HttpErrorCode} from "../mnt_api_config"
import { UserInfo, UserModel, UserToken } from "../model/User";
import { Controller } from "./Controller";

class UserController extends Controller
{
    static commit(app : Express)
    {
        app.post("/register",   UserController.addNewUser);
        app.post("/login",      UserController.loginUser);
        app.post("/logout",     UserController.logoutUser);
        app.get( "/profile",    UserController.getUserProfile);
    }

    static async addNewUser(req : Request, resp : Response)
    {
        try
        {
            let userInfo : UserInfo = req.body;
            userInfo.password = bcrypt.hashSync(userInfo.password, Controller.bcryptSalt);
            const userDoc = await UserModel.create(userInfo);    
            resp.json(userDoc);
        }
        catch (e)
        {
            resp.status(HttpErrorCode.UnprocessableEntity).json(e);
        }
    }
    
    static async loginUser(req : Request, resp : Response)
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
                    jwt.sign(userToken, Controller.jwtSecret, {}, 
                        (err, token) =>
                        {
                            if (err) throw err;
                            resp.cookie(Controller.loginCookieName, token).json(userDoc);
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
    }

    static async logoutUser(req : Request, resp : Response)
    {
        resp.cookie(Controller.loginCookieName, "").json(true);
    }

    static async getUserProfile(req : Request, resp : Response)
    {
        const {token} = req.cookies;
        if (token)
        {
            jwt.verify(token, Controller.jwtSecret, {}, async (err, userData) =>
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
    }
};

export
{
    UserController
}

/*

class A {
  add: (a: number, b: number) => number;
}

A.prototype.add = (a: number, b: number): number => {
  return a + b;
}

*/
