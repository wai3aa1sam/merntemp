
import * as dotenv from "dotenv";
import * as mnt from "../../core/mnt_core"

dotenv.config();

class EnvVariables
{
    apiDataBaseUrl : string = "";

    public static get instance() { return this.s_instance || (this.s_instance = new this()); }
    private constructor() {}
    private static s_instance : EnvVariables;
};
export { EnvVariables }

EnvVariables.instance;
EnvVariables.instance.apiDataBaseUrl = process.env["MNT_API_DB_URL"] as string;

export * from "../../core/mnt_core"