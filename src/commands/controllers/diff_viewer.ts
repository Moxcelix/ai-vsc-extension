import * as vscode from 'vscode';
import { EditFileResult } from '../../domain/edit_file_result';

export class DiffViewer {
    private currentDiff: vscode.TextDocument | null = null;
    private textEditDisposable: vscode.Disposable | null = null;

    async showDiff(result: EditFileResult): Promise<void> {
        this.currentDiff = await vscode.workspace.openTextDocument({
            content: result.modifiedContent,
            language: this.getLanguageId(result.filePath)
        });

        await vscode.commands.executeCommand(
            'vscode.diff',
            vscode.Uri.file(result.filePath),
            this.currentDiff.uri,
            `AI Edit: ${result.filePath}`,
            { preview: true }
        );
        
        this.textEditDisposable = vscode.window.onDidChangeActiveTextEditor(async (editor) => {
            await this.showActionButtons(result);
        });

        await this.showActionButtons(result);
    }

    private async showActionButtons(result: EditFileResult): Promise<void> {
        const action = await vscode.window.showInformationMessage(
            'AI has suggested changes. What would you like to do?',
            'Apply Changes',
            'Revert',
            'Cancel'
        );

        switch (action) {
            case 'Apply Changes':
                await this.applyChanges(result);
                await this.closeEditor()
                break;
            case 'Revert':
                await this.revertChanges(result);
                await this.closeEditor()
                break;
            case 'Cancel':
                break;
        }
    }

    private async closeEditor(): Promise<void>{
        await this.textEditDisposable?.dispose()
        if(this.currentDiff){
            await vscode.window.showTextDocument(this.currentDiff as vscode.TextDocument);
            await vscode.commands.executeCommand('workbench.action.revertAndCloseActiveEditor');
        }
    }

    private async applyChanges(result: EditFileResult): Promise<void> {
        const document = await vscode.workspace.openTextDocument(result.filePath);
        const edit = new vscode.WorkspaceEdit();
        
        const fullRange = new vscode.Range(
            document.positionAt(0),
            document.positionAt(document.getText().length)
        );
        
        edit.replace(document.uri, fullRange, result.modifiedContent);
        
        await vscode.workspace.applyEdit(edit);
        await document.save();

        await this.closeEditor();
        
        vscode.window.showInformationMessage('Changes applied successfully!');
    }

    private async revertChanges(result: EditFileResult): Promise<void> {
        vscode.window.showInformationMessage('Changes reverted');
    }

    private getLanguageId(filePath: string): string {
        const ext = filePath.split('.').pop()?.toLowerCase() || '';
        const languageMap: Record<string, string> = {
            'js': 'javascript',
            'ts': 'typescript',
            'py': 'python',
            'java': 'java',
            'cpp': 'cpp',
            'h': 'cpp',
            'html': 'html',
            'css': 'css',
            'json': 'json',
            'xml': 'xml',
            'md': 'markdown',
            'yaml': 'yaml',
            'yml': 'yaml'
        };
        return languageMap[ext] || 'plaintext';
    }
}