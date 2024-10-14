import mongoose from "mongoose";

class UserInfo extends mongoose.Document
{
    name        : string = "";
    email       : string = "";
    password    : string = "";
};

interface UserToken
{
    email : string;
    id    : unknown;
};

const UserSchema = new mongoose.Schema<UserInfo>(
    {
        name        : String,
        email       : {type : String, unique : true},
        password    : String
    }
);

const UserModel = mongoose.model<UserInfo>("User", UserSchema);

export 
{
    UserModel
    , UserInfo
    , UserToken
}