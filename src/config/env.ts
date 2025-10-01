import * as dotenv from "dotenv";

import * as path from 'path'

dotenv.config({ path: path.join(__dirname, '../../.env') });

export class Env {
    public GigachatClientID :string = '01996760-13d1-7f11-8890-a26c15069f42';//process.env.GIGACHAT_CLIENT_ID as string;
    public GigachatClientSecret: string = '6c981378-d8ff-43db-8045-639ff27a24e9';//process.env.GIGACHAT_CLIENT_SECRET as string;
    public GigachatScope: string = 'GIGACHAT_API_PERS';//process.env.GIGACHAT_SCOPE as string;
    public GigachatApiUrl: string = 'https://gigachat.devices.sberbank.ru/api/v1';//process.env.GIGACHAT_API_URL as string;
    public GigachatTokenUrl:string = 'https://ngw.devices.sberbank.ru:9443/api/v2/oauth';//process.env.GIGACHAT_TOKEN_URL as string;
}