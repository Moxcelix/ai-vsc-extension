import { EditFileRequest } from "../domain/edit_file_request";
import { EditFileResult } from "../domain/edit_file_result";
import { FileEditor } from "../domain/file_editor";
import { LLM } from "../domain/llm";

export class AIFileEditor implements FileEditor{
    private llm : LLM;
    constructor (llm: LLM){
        this.llm = llm;
    }

    public async editFile(request: EditFileRequest): Promise<EditFileResult> {
        const prompt = this.buildEditPrompt(request);
        
        const response = await this.llm.query(prompt, 0.3, 2000);
        
        return this.parseAIResponse(response, request);
    } 

    private buildEditPrompt(request: EditFileRequest): string {
        return `
            You are an AI assistant for editing code. 
            You will be provided with a file and instructions on how to edit it.
            INTRUCTIONS: ${request.instructions}
            FILE: ${request.filePath}
            FILE CONTENT:
            \`\`\`
            ${request.originalContent}
            \`\`\`
            Revert ONLY the modified version of the file, without further explanation. 
            Preserve the formatting and structure.
            If no changes are required, revert to the original content.
            `;
    }

    private parseAIResponse(response: string, request: EditFileRequest): EditFileResult {
        const modifiedContent = this.extractCodeFromResponse(response);
        
        return {
            originalContent: request.originalContent,
            modifiedContent: modifiedContent,
            filePath: request.filePath
        };
    }

    private extractCodeFromResponse(response: string): string {
        const start = response.indexOf('```');
        const end = response.indexOf('```', start + 3);
        
        if (start === -1 || end === -1) {
            return response.trim();
        }
        
        return response.substring(start + 3, end).trim();
    }
}   