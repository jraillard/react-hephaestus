import * as fs from 'fs';
import * as path from 'path';
import { workspace } from 'vscode';
import { config } from './configuration';

/**
 * Helper for file management
 */
export class FileHelper {
	public static projectRoot = workspace.workspaceFolders
		? workspace.workspaceFolders[0].uri.fsPath
		: '/';

	/**
	 * Find directory from file path
	 * @param filePath : File path
	 * @returns
	 */
	public static findDir(filePath: string): string | null {
		if (!filePath) {
			return null;
		}
		if (fs.statSync(filePath).isFile()) {
			return path.dirname(filePath);
		}

		return filePath;
	}

	/**
	 * Allow to find relative path to the project root
	 * @param inputPath : Path to convert
	 * @returns Relative Path
	 */
	public static findRelativePath(inputPath: string): string {
		inputPath = inputPath || '/';
		if (path.resolve(inputPath) === inputPath) {
			inputPath = inputPath
				.substring(this.projectRoot.length)
				.replace(/\\/g, '/');
		}
		if (!inputPath.endsWith('/')) {
			inputPath += '/';
		}

		return inputPath;
	}

	/**
	 * Create a directory hierarchy
	 * @param dir : Directory full path
	 * @returns : Directory created full path
	 */
	public static makeDirSync(dir: string): string {
		if (fs.existsSync(dir)) {
			const {
				files: { rewrite: rewriteValue },
			} = config();

			if (!rewriteValue) throw new Error('You disabled file rewrite option.');

			// Delete and recreate in order to rewrite files even if they already have been created
			fs.rmSync(dir, { recursive: true, force: true });
		}

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
