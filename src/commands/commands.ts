import { QuestionController } from "./controllers/question"
import * as vscode from 'vscode';


export class Commands {
    private questionController: QuestionController;

    public constructor(questionCommand: QuestionController){
        this.questionController = questionCommand;
    }

    public setup(context: vscode.ExtensionContext){
        context.subscriptions.push(
            vscode.commands.registerCommand('ai-assistant.askQuestion', this.questionController.command),
        );
    }
}