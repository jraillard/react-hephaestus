import path from 'path';
import { ComponentFilesExtension } from '../configuration/enums';

/**
 * Get template name
 * @param fileType : file type
 * @param fileExtension : extension file
 * @returns Template full path
 */
export const getTemplateName = (
	fileType: 'index' | 'hook' | 'types',
	fileExtension: ComponentFilesExtension
): string => {
	const assetRootDir: string = path.join(__dirname, '../../assets');

	let langage = '';
	switch (fileExtension) {
		case ComponentFilesExtension.js:
			langage = 'js';
			break;
		case ComponentFilesExtension.ts:
		default:
			langage = 'ts';
			break;
	}

	return `${assetRootDir}/templates/${langage}/component-${fileType}-${langage}.hbs`;
};
