import * as vscode from 'vscode';
import { FileEditUsecase } from '../../application/file_edit';
import { DiffViewer } from './diff_viewer';

export class FileEditController {
    constructor(
        private usecase: FileEditUsecase,
        private diffViewer: DiffViewer
    ) {}

    public command = async () => {
        const editor = vscode.window.activeTextEditor;
        
        if (!editor) {
            vscode.window.showWarningMessage('No active file editor');
            return;
        }

        const filePath = editor.document.fileName;
        const originalContent = editor.document.getText();

        const instructions = await vscode.window.showInputBox({
            placeHolder: 'What changes would you like to make?',
            prompt: 'Describe the changes you want AI to make in this file'
        });

        if (!instructions) {
            return;
        }

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: "AI is editing the file...",
            cancellable: false
        }, async (progress) => {
            try {
                const result = await this.usecase.execute({
                    filePath,
                    instructions,
                    originalContent
                });

                await this.diffViewer.showDiff(result);
                
            } catch (error) {
                vscode.window.showErrorMessage(
                    `File edit failed: ${error instanceof Error ? error.message : 'Unknown error'}`
                );
            }
        });
    };
}