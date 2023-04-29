import { Uri, workspace } from 'vscode';

export default function getConfig(uri?: Uri) {
	//TODO
	return workspace.getConfiguration('ACReactComponentGenerator', uri) as any;
}
