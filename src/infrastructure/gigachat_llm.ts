process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

import { LLM } from '../domain/llm'
import { Env } from '../config/env'
import { randomUUID } from 'crypto';
import axios from 'axios';

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
        const response = await axios.post(
            `${this.baseUrl}/chat/completions`,
            payload,
            {
                headers: await this.getAuthHeaders(),
                timeout: 30000
            }
        );
        return response.data.choices[0].message.content;
    }

    private getBasicAuthHeader(): string {
        const credentials = `${this.clientId}:${this.clientSecret}`; 
        const encodedCredentials = Buffer.from(credentials).toString('base64');
        return `Basic ${encodedCredentials}`;
    }

    private async getAccessToken(): Promise<string> {
        if (this.accessToken.token !== 'None' && Date.now() < this.accessToken.expiresAt) {
            return this.accessToken.token;
        }

        const data = {
            'scope': this.scope
        };

        const response = await axios.post(this.tokenUrl, data, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'application/json',
                'RqUID': randomUUID(),
                'Authorization': this.getBasicAuthHeader()
            },
            timeout: 10000
        });
            
        this.accessToken.token = response.data.access_token;
        this.accessToken.expiresAt = Date.now() + (response.data.expires_in * 1000) - 60000;

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