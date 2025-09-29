import { LLM } from '../domain/llm'
import { Env } from '../config/env'
import { randomUUID } from 'crypto';

export class GigachatLLM implements LLM {
    private clientId: string;
    private clientSecret: string; 
    private scope: string;
    private baseUrl: string;
    private tokenUrl: string;
    private accessToken: { token: string; expiresAt: number };

    public constructor(env: Env) {
        this.clientId = env.GigachatClientID;
        this.clientSecret = env.GigachatClientSecret; 
        this.baseUrl = env.GigachatApiUrl;
        this.tokenUrl = env.GigachatTokenUrl;
        this.scope = env.GigachatScope;

        this.accessToken = { token: 'None', expiresAt: 0 };
    }

    public async query(text: string, temperature: number, maxTokens: number): Promise<string> {
        const payload = {
            'model': 'GigaChat',
            'messages': [
                {
                    'role': 'user',
                    'content': text
                }
            ],
            'temperature': temperature,
            'max_tokens': maxTokens,
            'stream': false
        };

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: await this.getAuthHeaders(),
            body: JSON.stringify(payload)
        });

        const content = await response.json() as {
            choices: Array<{
                message: {
                    content: string
                }
            }>
        };

        return content.choices[0].message.content; 
    }

    private getBasicAuthHeader(): string {
        let credentials: string = `${this.clientId}:${this.clientSecret}`; 
        let encodedCredentials: string = Buffer.from(credentials).toString('base64');
        return `Basic ${encodedCredentials}`;
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken.token !== 'None' && Date.now() < this.accessToken.expiresAt) {
            return this.accessToken.token;
        }

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'RqUID': randomUUID(),
            'Authorization': this.getBasicAuthHeader()
        }

        const data = new URLSearchParams({
            'scope': this.scope
        });

        const response = await fetch(this.tokenUrl, {
            method: 'POST',
            body: data, 
            headers: headers,
        });

        const content = await response.json() as { access_token: string, expires_in: number };

        this.accessToken.token = content.access_token;
        this.accessToken.expiresAt = Date.now() + (content.expires_in * 1000) - 60000;

        return this.accessToken.token;
    }

    private async getAuthHeaders(): Promise<{ 
        'Authorization': string,
        'Content-Type': string
    }> {
        const token = await this.getAccessToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    }
}