import * as dotenv from "dotenv";

import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') });

export class Env {
    public GigachatClientID :string = process.env.GIGACHAT_CLIENT_ID as string;
    public GigachatClientSecret: string = process.env.GIGACHAT_CLIENT_SECRET as string;
    public GigachatScope: string = process.env.GIGACHAT_SCOPE as string;
    public GigachatApiUrl: string =process.env.GIGACHAT_API_URL as string;
    public GigachatTokenUrl:string = process.env.GIGACHAT_TOKEN_URL as string;

}