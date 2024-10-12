import mongoose from "mongoose";

class UserInfo
{
    name        : string = "";
    email       : string = "";
    password    : string = "";
};

const UserSchema = new mongoose.Schema<UserInfo>(
    {
        name        : String,
        email       : {type : String, unique : true},
        password    : String
    }
);

const UserModel = mongoose.model("User", UserSchema);

export 
{
    UserModel
    , UserInfo
}