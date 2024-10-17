
class Controller
{
    static bcryptSalt       : string = "";
    static jwtSecret        : string = "";
    static loginCookieName  : string = "";

    static init(bcryptSalt : string, jwtSecret : string, loginCookieName : string)
    {
        this.bcryptSalt         = bcryptSalt;
        this.jwtSecret          = jwtSecret;
        this.loginCookieName    = loginCookieName;
        //console.log(this.jwtSecret);
    }
}

export
{
    Controller
}