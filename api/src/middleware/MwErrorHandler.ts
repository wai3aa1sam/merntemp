/*
    reference: 
    ~ errorHandler.js from https://github.com/gitdagray/express_middleware/blob/main/middleware/errorHandler.js
*/

import { Request, Response, NextFunction } from "express";

const { logEvents } = require('./MwLogger');

const mwErrorHandler = (err : any, req : Request, res : Response, next : NextFunction) => 
{
    logEvents(`${err.name}: ${err.message}`, 'errLog.txt');
    console.error(err.stack)
    res.status(500).send(err.message);
}

export
{
    mwErrorHandler
}