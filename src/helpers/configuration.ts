import { WorkspaceConfiguration, workspace } from 'vscode';
import { ConfigurationSchema } from '../configuration/configurationSchema';
import { Value } from '@sinclair/typebox/value';
import {
	ComponentFilesExtension,
	HookFileExtension,
	IndexFileExtension,
	TypesFileExtension,
} from '../configuration/enums';

/**
 * Methode allowing to convert vsCodeConfiguration into sinclair/typebox one
 * @param vsCodeConfiguration : vscode configuration
 * @returns : sinclair/typebox understandable configuration
 */
const vsCodeConfigurationConverter = (
	vsCodeConfiguration: WorkspaceConfiguration
) => {
	const {
		global: { quotes: quoteValue },
		files: { rewrite: rewriteValue },
		components: { useHooks: useHooksValue, extension: extensionValue },
	} = vsCodeConfiguration;

	// Those configs are built in the app cause it's no sense to shuffle js and ts files
	let filesExtension;
	switch (extensionValue) {
		case ComponentFilesExtension.js:
			filesExtension = {
				hook: HookFileExtension.js,
				index: IndexFileExtension.jsx,
				types: TypesFileExtension.js,
			};
			break;
		case ComponentFilesExtension.ts:
		default:
			filesExtension = {
				hook: HookFileExtension.ts,
				index: IndexFileExtension.tsx,
				types: TypesFileExtension.ts,
			};
			break;
	}

	return {
		global: {
			quotes: quoteValue,
		},
		files: {
			extension: { ...filesExtension },
			rewrite: rewriteValue,
		},
		components: {
			useHooks: useHooksValue,
			extension: extensionValue,
		},
	};
};

/**
 * Retrieves the validated configuration
 * @returns : Validated configuration / Error exception if not valid
 */
const config = () => {
	const configuration = workspace.getConfiguration('reactHephaestus');
	const convertedConfiguration = vsCodeConfigurationConverter(configuration);
	const errors = [...Value.Errors(ConfigurationSchema, convertedConfiguration)];

	if (!errors || errors.length > 0) {
		let errorMessage = '';

		const distinctErrors = new Set(errors.map((err) => err.path));
		distinctErrors.forEach((path: string) => {
			const foundedError = errors.find((err) => err.path === path);
			errorMessage = errorMessage.concat(
				`"${foundedError?.value}" is not a valid value for ${path}. `
			);
		});

		throw new Error(
			`React Hephaestus configuration is not valid : ${errorMessage}`
		);
	}

	return convertedConfiguration;
};

/**
 * Helper getting quote character from quote mode set in configuration
 * @param quoteMode : quoteMode
 * @returns : quote character
 */
const quoteCharacter = (quoteMode: 'single' | 'double'): string => {
	switch (quoteMode) {
		case 'double':
			return '"';
		case 'single':
		default:
			return "'";
	}
};

export { config, quoteCharacter };
