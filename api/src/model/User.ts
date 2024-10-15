import mongoose from "mongoose";

interface UserInfo // extends mongoose.Document
{
    name        : string;
    email       : string;
    password    : string;
};

interface UserToken
{
    email : string;
    id    : unknown;
};

const userSchema = new mongoose.Schema<UserInfo>(
    {
        name        : String,
        email       : {type : String, unique : true},
        password    : String
    }
);

const UserModel = mongoose.model<UserInfo>("User", userSchema);

export 
{
    UserModel
    , UserInfo
    , UserToken
}