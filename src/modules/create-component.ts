import { concatMap, first, forkJoin, from, of, tap } from 'rxjs';
import {
	ExtensionContext,
	TextDocument,
	TextEditor,
	window,
	workspace,
} from 'vscode';
import { ComponentCreatorProps, ComponentHelper } from '../helpers/component';
import { FileHelper } from '../helpers/file';
import { logError, logSuccess } from '../helpers/logger';
import { config } from '../helpers/configuration';

/**
 * Create component command
 * @param context : Vscode extension context
 * @param relativePath : Relative path
 */
export function createComponent(
	context: ExtensionContext,
	relativePath: string | null
) {
	context.subscriptions.push(
		window.setStatusBarMessage('Preparing the forge 🔥')
	);

	from(
		// Display dialog to ask for component name
		window.showInputBox({
			value: FileHelper.findRelativePath(relativePath || '/'),
			prompt: 'Please enter the component name with its full path',
			placeHolder: '/src/components/ButtonComponent',
			ignoreFocusOut: true,
			valueSelection: [-1, -1],
			validateInput: (value: string) => {
				// Validation
				if (!value || value.length === 0) {
					return 'Path cannot be empty';
				}

				if (value.endsWith('/')) {
					return 'Path should end with the Component name';
				}

				if (!value.startsWith('/')) {
					return "Path should start with '/' (relative path)";
				}
			},
		})
	)
		.pipe(
			concatMap((inputPath: string | undefined) => {
				if (!inputPath || inputPath.length === 0) {
					throw new Error('Forging aborted ❄️');
				}
				window.setStatusBarMessage('Forging 🔨');

				const { componentDir, componentName } =
					ComponentHelper.createComponentDir(inputPath);

				const {
					components: { useHooks: useHooksValue, extension: extensionValue },
				} = config();

				const params: ComponentCreatorProps = {
					componentDir,
					componentName,
					useHooks: useHooksValue,
					filesExtension: extensionValue,
				};

				return forkJoin([
					of(ComponentHelper.createComponentIndex(params)),
					of(ComponentHelper.createComponentHook(params)),
					of(ComponentHelper.createComponentTypes(params)),
				]);
			}),
			// Gather previous observables (containing file created name)
			concatMap((result: [string, string, string]) => from(result)),
			// Get the first one : Component index file
			first(),
			// Try Open document
			concatMap((fileName: string) =>
				from(workspace.openTextDocument(fileName))
			),
			concatMap((textDocument: TextDocument) => {
				if (!textDocument) {
					throw new Error('Could not open file! 😮');
				}

				return from(window.showTextDocument(textDocument));
			}),
			tap((editor: TextEditor) => {
				if (!editor) {
					throw new Error('Could not open file 😬');
				}
			})
		)
		.subscribe({
			complete: () =>
				context.subscriptions.push(logSuccess('React component forged ✔️')),
			error: (err) => {
				logError(err.message);
				context.subscriptions.push(window.setStatusBarMessage(''));
			},
		});
}
