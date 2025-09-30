export interface LLM {
    query (text: string, temperature: number, maxTokens: number) : Promise<string>;
}