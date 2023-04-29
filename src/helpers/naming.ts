import { camelCase, pascalCase } from 'change-case';

export function formatPathToComponentName(unformatedName: string): string {
	let componentName = camelCase(unformatedName);
	componentName = pascalCase(unformatedName);

	return componentName;
}
