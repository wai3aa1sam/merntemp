/*
    reference: 
    ~ logEvents.js from https://github.com/gitdagray/express_middleware/blob/main/middleware/logEvents.js
*/

import { Request, Response, NextFunction } from "express";

const { format }    = require('date-fns');
const { v4: uuid }  = require('uuid');

const fs = require('fs');
const fsPromises = require('fs').promises;
const path = require('path');

const logDir = path.join(__dirname, '..', "..", 'log');

const logEvents = async (message : string, filename : string, outputDir : string = logDir) => 
{
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;

    try {
        if (!fs.existsSync(outputDir)) {
            await fsPromises.mkdir(outputDir);
        }

        await fsPromises.appendFile(path.join(outputDir, filename), logItem);
    } catch (err) {
        console.log(err);
    }
}

const mwLogger = (req : Request, res : Response, next : NextFunction) => 
{
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');
    //console.log(`${req.method} ${req.path}`);
    next();
}

export
{
    mwLogger
    , logEvents
}