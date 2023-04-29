import { ExtensionContext, Uri, commands, window } from 'vscode';
import { EMPTY, concatMap, from } from 'rxjs';
import { logger } from './helpers/logger';
import { formatPathToComponentName } from './helpers/naming';
import { ComponentHelper } from './helpers/component';
import { FileHelper } from './helpers/file';
import path = require('path');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
	const commandsArray = [
		{
			commandId: 'react-hephaestus.forgeReactComponent',
		},
	];

	commandsArray.forEach((cmd) => {
		const disposable = commands.registerCommand(cmd.commandId, (uri: Uri) =>
			createComponent(uri ? FileHelper.findDir(uri.fsPath) : '/')
		);
		context.subscriptions.push(disposable);
	});
}

// This method is called when your extension is deactivated
export function deactivate() {}

const createComponent = (relativePath: string | null) => {
	window.showInformationMessage('Preparing the forge 🔥');

	//Display dialog to ask for component name
	let enterComponentNameDialog$ = from(
		window.showInputBox({
			value: FileHelper.findRelativePath(relativePath || '/'),
			prompt: 'Please enter the component name with its full path',
			placeHolder: '/src/components/ButtonComponent',
			validateInput: (value: string) => {
				// Validation
				if (!value || value.length === 0) {
					return 'Path cannot be empty';
				}

				if (value.endsWith('/')) {
					return 'Path should end with the Component name';
				}

				if (!value.startsWith('/')) {
					return "Path should start with '/', meaning from root";
				}
			},
		})
	);

	enterComponentNameDialog$
		.pipe(
			concatMap((inputPath) => {
				if (!inputPath || inputPath.length === 0) {
					logger('error', 'Path cannot be empty!');
					throw new Error('Path cannot be empty!');
				}

				const componentName = formatPathToComponentName(
					inputPath.substring(inputPath.lastIndexOf('/') + 1)
				);

				let componentPath = path.join(
					FileHelper.projectRoot,
					inputPath.substring(0, inputPath.lastIndexOf('/')),
					componentName
				);

				const componentDir = FileHelper.makeDirSync(componentPath);

				ComponentHelper.createComponent(componentDir, componentName);
				return EMPTY;
			})
		)
		.subscribe({
			complete: () => logger('success', 'React component forged ✔️'),
			error: (err) => logger('error', err.message),
		});
};
