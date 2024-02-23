// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let addCheckItem = vscode.commands.registerCommand('todo-made-simple.addCheckItem', function () {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		vscode.window.showInformationMessage('Testing from TODO Made Simple!');

		// Create a decoration type
		const decorationType = vscode.window.createTextEditorDecorationType({
			gutterIconPath: context.asAbsolutePath('unchecked.svg'),
			gutterIconSize: '16px',
			overviewRulerLane: vscode.OverviewRulerLane.Center,
			rangeBehavior: 1, //Closed, Closed
		});

		// Define a range where you want to insert the clickable text
		const range = new vscode.Range(editor.selection.active, editor.selection.active);

		const decoration = {
			range: range,
			hoverMessage: 'Click to check', // Optional hover message
		};

		editor.setDecorations(decorationType, [decoration]);

		// Handle click events on gutter icons
		let disposable = vscode.window.onDidChangeTextEditorSelection(event => {
			if (event.textEditor === vscode.window.activeTextEditor) {
				const cursorPosition = event.selections[0].active;
				const line = cursorPosition.line;
				if (line === range.start.line) {
					vscode.window.showInformationMessage('You clicked the gutter icon!');
					// Add your desired functionality here
				}
			}
		});

		context.subscriptions.push(disposable);
	})
}

// Handle cursor position changes
/*let disposable = vscode.window.onDidChangeTextEditorSelection(event => {
	const activeEditor = vscode.window.activeTextEditor;

	console.log(checkboxes);
	if (event.textEditor === vscode.window.activeTextEditor) {
		const cursorPosition = event.selections[0].active;
		for (let i = 0; i < checkboxes.length; i++) {
			let range = checkboxes[i].position;
			if (range.contains(cursorPosition)) {
				console.log(event.kind, cursorPosition);
				switch (event.kind) {
					case undefined: //Event is a deletion
						checkboxes.splice(i, 1);
						vscode.window.showInformationMessage('You deleted the clickable text!');
						break;
					case 2: //Event is a selection
						vscode.window.showInformationMessage('You clicked the clickable text!');
						activeEditor.edit((editBuilder) => {
							if (checkboxes[i].state) {
								editBuilder.replace(range, CHECKED);
							} else {
								editBuilder.replace(range, UNCHECKED);
							}
							checkboxes[i].state = !checkboxes[i].state;
						})
						break;
					default:
						break;
				}
			}
		}

	}
});*/

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
