import * as vscode from 'vscode';
import { LLM } from './domain/llm';
import { GigachatLLM } from './infrastructure/gigachat_llm';
import { Env } from './config/env';
import { QuestionUsecase } from './application/question';
import { QuestionController } from './commands/controllers/question';
import { Commands } from './commands/commands';

export type App = {
    run(): void
}

export function createApp(context: vscode.ExtensionContext){
    const env: Env = new Env();
    const llm: LLM = new GigachatLLM(env);
    const questionUsecase: QuestionUsecase = new QuestionUsecase(llm);
    const questionController: QuestionController = new QuestionController(questionUsecase);
    const commands: Commands = new Commands(questionController);

    return { run() { commands.setup(context); }}
}