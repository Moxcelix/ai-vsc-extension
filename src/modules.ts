import * as vscode from 'vscode';
import { LLM } from './domain/llm';
import { GigachatLLM } from './infrastructure/gigachat_llm';
import { Env } from './config/env';
import { QuestionUsecase } from './application/question';
import { QuestionController } from './commands/controllers/question';
import { Commands } from './commands/commands';
import { FileEditUsecase } from './application/file_edit';
import { FileEditor } from './domain/file_editor';
import { AIFileEditor } from './infrastructure/ai_file_editor';
import { FileEditController } from './commands/controllers/file_edit';
import { DiffViewer } from './commands/controllers/diff_viewer';

export type App = {
    run(): void
}

export function createApp(context: vscode.ExtensionContext){
    const env: Env = new Env();
    const llm: LLM = new GigachatLLM(env);
    const fileEditor: FileEditor = new AIFileEditor(llm);
    const questionUsecase: QuestionUsecase = new QuestionUsecase(llm);
    const fileEditUsecase: FileEditUsecase = new FileEditUsecase(fileEditor);
    const diffViewer: DiffViewer = new DiffViewer();
    const questionController: QuestionController = new QuestionController(questionUsecase);
    const fileEditController: FileEditController = new FileEditController(fileEditUsecase, diffViewer);
    const commands: Commands = new Commands(questionController, fileEditController);

    return { run() { commands.setup(context); }}
}