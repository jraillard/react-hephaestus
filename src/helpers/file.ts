import * as fs from 'fs';
import * as path from 'path';
import { workspace } from 'vscode';

export class FileHelper {
	public static projectRoot = workspace.workspaceFolders
		? workspace.workspaceFolders[0].uri.fsPath
		: '/';

	public static findDir(filePath: string) {
		if (!filePath) {
			return null;
		}
		if (fs.statSync(filePath).isFile()) {
			return path.dirname(filePath);
		}

		return filePath;
	}

	public static findRelativePath(relativePath: string): string {
		relativePath = relativePath || '/';
		if (path.resolve(relativePath) === relativePath) {
			relativePath = relativePath
				.substring(this.projectRoot.length)
				.replace(/\\/g, '/');
		}
		if (!relativePath.endsWith('/')) {
			relativePath += '/';
		}

		return relativePath;
	}

	/**
	 * Create a directory hierarchy
	 * @param dir : Directory full path
	 * @returns : Directory created full path
	 */
	public static makeDirSync(dir: string): string {
		if (fs.existsSync(dir)) return '';
		if (!fs.existsSync(path.dirname(dir))) {
			this.makeDirSync(path.dirname(dir));
		}
		fs.mkdirSync(dir);
		return dir;
	}

	/**
	 * Create a file with a content
	 * @param file : File full path
	 * @param content : File content
	 */
	public static makeFileSync(file: string, content: string) {
		if (!fs.existsSync(file)) {
			fs.writeFileSync(file, content);
		}
	}
}
