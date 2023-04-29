import { paramCase } from 'change-case';
import path = require('path');
import { Observable, of } from 'rxjs';
import * as fs from 'fs';

export class ComponentHelper {
	private static assetRootDir: string = path.join(__dirname, '../../assets');

	/**
	 * Create main component file (index.tsx)
	 * @param componentDir : Directory of the component
	 * @param componentName : Component name in PascalCase
	 */
	public static createComponent(
		componentDir: string,
		componentName: string
	): Observable<string> {
		const paramCaseName = paramCase(componentName);

		const templateFileName =
			this.assetRootDir + `/templates/component-index.template`;

		const componentContent = fs
			.readFileSync(templateFileName)
			.toString()
			.replace(/{componentName}/g, componentName)
			.replace(/{componentNameInParamCase}/g, paramCaseName);

		const filename = path.join(componentDir, 'index.tsx');

		fs.createWriteStream(filename).write(componentContent);

		return of(filename);
	}
}
