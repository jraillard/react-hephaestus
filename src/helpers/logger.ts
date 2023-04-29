import { Disposable, window } from 'vscode';

/**
 * Log success message
 * @param msg : Message to log
 * @returns Disposable
 */
function logSuccess(msg: string = ''): Disposable {
	return window.setStatusBarMessage(`Success: ${msg}`, 5000);
}

/**
 * Log warning message
 * @param msg : Message to log
 * @returns Promise
 */
function logWarning(msg: string = ''): Thenable<string | undefined> {
	return window.showWarningMessage(`Warning: ${msg}`, { modal: true });
}

/**
 * Log error message
 * @param msg : Message to log
 * @returns Promise
 */
function logError(msg: string = ''): Thenable<string | undefined> {
	return window.showErrorMessage(`Failed: ${msg}`);
}

export { logSuccess, logError, logWarning };
