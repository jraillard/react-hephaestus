import { camelCase, pascalCase } from 'change-case';

/**
 * Helper to format component Name
 * @param unformatedName : Unformate component name
 * @returns : Formated component name
 */
export function formatPathToComponentName(unformatedName: string): string {
	let componentName = camelCase(unformatedName);
	componentName = pascalCase(unformatedName);

	return componentName;
}
