import { FileEditController } from "./controllers/file_edit";
import { QuestionController } from "./controllers/question"
import * as vscode from 'vscode';


export class Commands {
    private questionController: QuestionController;
    private fileEditController: FileEditController;

    public constructor(
        questionCommand: QuestionController, 
        fileEditController: FileEditController){
        this.questionController = questionCommand;
        this.fileEditController = fileEditController;
    }

    public setup(context: vscode.ExtensionContext){
        context.subscriptions.push(
            vscode.commands.registerCommand('ai-assistant.askQuestion', this.questionController.command),
            vscode.commands.registerCommand('ai-assistant.editFile', this.fileEditController.command),
        );
    }
}