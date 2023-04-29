import { ExtensionContext, Uri, commands } from 'vscode';
import { FileHelper } from './helpers/file';
import { createComponent } from './modules/create-component';

/**
 * React Hephaestus activation
 * @param context : Extension context
 */
export function activate(context: ExtensionContext) {
	const commandsArray = [
		{
			commandId: 'react-hephaestus.forgeReactComponent',
		},
	];

	commandsArray.forEach((cmd) => {
		const disposable = commands.registerCommand(cmd.commandId, (uri: Uri) =>
			createComponent(context, uri ? FileHelper.findDir(uri.fsPath) : '/')
		);
		context.subscriptions.push(disposable);
	});
}

/**
 * React Hephaestus deactivation
 */
export function deactivate() {}
