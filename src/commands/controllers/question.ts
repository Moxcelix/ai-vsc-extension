import { QuestionUsecase } from "../../application/question";
import * as vscode from 'vscode';

export class QuestionController{
    private usecase: QuestionUsecase;

    public constructor(usecase: QuestionUsecase){
        this.usecase = usecase;
    }

    public command = async () => {
        const question = await vscode.window.showInputBox({
            placeHolder: 'Enter your question',
            prompt: 'AI Assistant helps you!'
        });

        if (!question) {
            return; 
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "AI Assistant is thinking...",
            cancellable: false
        }, async (progress) => {
            try {
                const answer = await this.usecase.execute(question);

                vscode.window.showInformationMessage(answer);
                
            } catch (error) {
                vscode.window.showErrorMessage(
                    `Error: ${ error instanceof Error ? 
                        error.message : 
                        'Unknown error!'}`);
            }
        });
    }
}