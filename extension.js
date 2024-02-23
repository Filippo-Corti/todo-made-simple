// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

const UNCHECKED = "☐";
const CHECKED = "☑";

const COMMAND = "!TODO";


/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	let addCheckItem = vscode.commands.registerCommand('todo-made-simple.addCheckItem', function () {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}

		editor.edit((editBuilder) => {
			//Add Checkbox
			editBuilder.insert(editor.selection.active, UNCHECKED + " ");
		}).then(() => {
			//Add Tooltip

			// Define a range where you want to insert the clickable text
			const range = new vscode.Range(editor.selection.active.translate(0, -2), editor.selection.active.translate(0, -1));
			const decoration = {
				range: range,
				hoverMessage: 'Click to check', // Optional hover message
			};
			const decorationTypePopup = vscode.window.createTextEditorDecorationType({
				rangeBehavior: 1, //Closed, Closed
				cursor: 'pointer',
			});
			editor.setDecorations(decorationTypePopup, [decoration]);
		})
	});

	//Handle clicks
	let toggleCheckboxes = vscode.window.onDidChangeTextEditorSelection(event => {
		if (event.textEditor !== vscode.window.activeTextEditor) {
			return;
		}
		const activePosition = event.selections[0].active;
		switch (event.kind) {
			case 1: //Inserting text
				const rangeForTODOText = new vscode.Range(activePosition.translate(0, - COMMAND.length), activePosition);
				const text = event.textEditor.document.getText(rangeForTODOText);
				if (text == COMMAND) {
					event.textEditor.edit((editBuilder) => {
						//Add Checkbox
						editBuilder.replace(rangeForTODOText, "");
					}).then(() => {
						vscode.commands.executeCommand('todo-made-simple.addCheckItem');
					})
				}
				break;
			case 2: //Selecting text
				//Try checking the right side of the cursor
				try {
					const rangeRight = new vscode.Range(activePosition, activePosition.translate(0, 1));
					const charOnTheRight = event.textEditor.document.getText(rangeRight);
					replaceChar(rangeRight, charOnTheRight);
				} catch (e) { }
				//Try checking the left side of the cursor
				try {
					const rangeLeft = new vscode.Range(activePosition.translate(0, -1), activePosition);
					const charOnTheLeft = event.textEditor.document.getText(rangeLeft);
					replaceChar(rangeLeft, charOnTheLeft);
				} catch (e) { }
				break;
			default:
				break;
		}
	});


	/**
	 * 
	 * @param {vscode.Range} range
	 * @param {string} char
	 */
	function replaceChar(range, char) {
		const editor = vscode.window.activeTextEditor;
		const decorationRange = editor.document.lineAt(range.start).range;

		const decoration = {
			range: decorationRange,
		};

		//Empty but editable if wanted
		const decorationTypeChecked = vscode.window.createTextEditorDecorationType({
		});

		const decorationTypeUnchecked = vscode.window.createTextEditorDecorationType({
		});

		if (char == UNCHECKED) {
			//Check the box and add decoration
			editor.edit((editBuilder) => {
				editBuilder.replace(range, CHECKED);
			}).then(() => {
				editor.setDecorations(decorationTypeChecked, [decoration]);
			});
		} else if (char == CHECKED) {
			//Uncheck the box and remove the decoration
			editor.edit((editBuilder) => {
				editBuilder.replace(range, UNCHECKED);
			}).then(() => {
				editor.setDecorations(decorationTypeUnchecked, [decoration]);
			});
		}
	}

	context.subscriptions.push(toggleCheckboxes);
	context.subscriptions.push(addCheckItem);
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
