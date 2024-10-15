

class ProjectSettings
{
    port            : number = 7000;
    serverUrl       : string = `http://localhost:${this.port}`;
    uploadPhotoDir  : string = "upload/photo"

    public get serverUploadPhotoUrl() : string { return `${this.serverUrl}/${this.uploadPhotoDir}`; }

    public static get instance() { return this.s_instance || (this.s_instance = new this()); }
    private constructor() {}
    private static s_instance : ProjectSettings;
};

enum HttpErrorCode
{
    None = 0,
    UnprocessableEntity = 422,
};

export { ProjectSettings, HttpErrorCode }

/*

//export namespace mnt
//{

// export class ProjectSetting
// {
//     private static s_instance : ProjectSetting;

//     root    : string = "";
//     envPath : string = "";
//     port    : number = 0;

//     public static get instance() { return this.s_instance || (this.s_instance = new this()); }

//     public create()
//     {
//         this.port = Number(process.env.MNT_PORT);
//     }

//     private constructor()
//     {
//         this.root       = path.resolve(__dirname, "../");
//         this.envPath    = path.resolve(this.root, "client/.env");

//         this.port       = 0;

//         console.log("ProjectSetting inited");
//     }
// };

//}

*/
