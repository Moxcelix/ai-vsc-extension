interface LLM {
    query (text: string, temperature: number, maxTokens: bigint) : string;
}