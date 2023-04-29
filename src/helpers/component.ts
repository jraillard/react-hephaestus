import { paramCase } from 'change-case';
import path = require('path');
import * as fs from 'fs';
import { formatPathToComponentName } from './naming';
import { FileHelper } from './file';
import { config, quoteCharacter } from './configuration';
import Handlebars from 'handlebars';
import { ComponentFilesExtension } from '../configuration/enums';
import { getTemplateName } from './template';

/**
 * Helper for creating component
 */
export class ComponentHelper {
	/**
	 * Create component directory
	 * @param inputPath : Relative path prompted by user
	 */
	public static createComponentDir(inputPath: string): {
		componentDir: string;
		componentName: string;
	} {
		const componentName = formatPathToComponentName(
			inputPath.substring(inputPath.lastIndexOf('/') + 1)
		);

		let componentPath = path.join(
			FileHelper.projectRoot,
			inputPath.substring(0, inputPath.lastIndexOf('/')),
			componentName
		);

		const componentDir = FileHelper.makeDirSync(componentPath);

		return { componentDir, componentName };
	}

	/**
	 * Create main component file (index.tsx)
	 * @param componentDir : Directory of the component
	 * @param componentName : Component name in PascalCase
	 */
	public static createComponentIndex({
		componentDir,
		componentName,
		filesExtension,
	}: ComponentCreatorProps): string {
		// Get index file config
		const {
			global: { quotes: quoteMode },
			files: {
				extension: { index: indexExtension },
			},
			components: { useHooks: useHooksValue },
		} = config();

		const paramCaseName = paramCase(componentName);

		const hbsTemplate = Handlebars.compile(
			fs.readFileSync(getTemplateName('index', filesExtension)).toString()
		);

		const componentContent = hbsTemplate({
			componentName: componentName,
			quotes: new Handlebars.SafeString(quoteCharacter(quoteMode)),
			componentNameInParamCase: paramCaseName,
			useHooks: useHooksValue,
		});

		const filename = path.join(componentDir, `index.${indexExtension}`);

		fs.writeFileSync(filename, componentContent);

		return filename;
	}

	/**
	 * Create component hook file (hook.ts)
	 */
	public static createComponentHook({
		componentDir,
		useHooks,
		filesExtension,
	}: ComponentCreatorProps): string {
		// No hook file to create in that case
		if (!useHooks) return '';

		// Get hook file config
		const {
			global: { quotes: quoteMode },
			files: {
				extension: { hook: hookExtension },
			},
		} = config();

		const hbsTemplate = Handlebars.compile(
			fs.readFileSync(getTemplateName('hook', filesExtension)).toString()
		);

		const componentContent = hbsTemplate({
			quotes: new Handlebars.SafeString(quoteCharacter(quoteMode)),
		});

		const filename = path.join(componentDir, `hook.${hookExtension}`);

		fs.writeFileSync(filename, componentContent);

		return filename;
	}

	/**
	 * Create component types file (hook.ts)
	 * @param componentDir : Directory of the component
	 * @param componentName : Component name in PascalCase
	 */
	public static createComponentTypes({
		componentDir,
		componentName,
		filesExtension,
	}: ComponentCreatorProps): string {
		// No types files to create in that case
		if (filesExtension === ComponentFilesExtension.js) return '';

		// Get hook file config
		const {
			global: { quotes: quoteMode },
			files: {
				extension: { types: typesExtension },
			},
			components: { useHooks: useHooksValue },
		} = config();

		const hbsTemplate = Handlebars.compile(
			fs.readFileSync(getTemplateName('types', filesExtension)).toString()
		);

		const componentContent = hbsTemplate({
			componentName: componentName,
			quotes: new Handlebars.SafeString(quoteCharacter(quoteMode)),
			useHooks: useHooksValue,
		});

		const filename = path.join(componentDir, `types.${typesExtension}`);

		fs.writeFileSync(filename, componentContent);

		return filename;
	}
}

export type ComponentCreatorProps = {
	componentDir: string;
	componentName: string;
	useHooks: boolean;
	filesExtension: ComponentFilesExtension;
};
