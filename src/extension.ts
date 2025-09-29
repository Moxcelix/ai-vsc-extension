import * as vscode from 'vscode';

import { createApp } from './modules';

export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "ai-assistant" is now active!');

	const app = createApp(context);

	app.run();
}

export function deactivate() {}
