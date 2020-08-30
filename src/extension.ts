import * as vscode from "vscode";
import loadList from "./data/loadList";

export function activate(context: vscode.ExtensionContext) {
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "emojito.showEmojiList",
    () => {
      // load emoji list
      const data = loadList();

      // access the editor
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage("Open or create a document!");
        return;
      }

      const position = editor.selection.active;

      // create quick pick
      const quickPick = vscode.window.createQuickPick();
      quickPick.items = data.map((emoji) => ({
        label: `${emoji.emoji} ${emoji.name}`,
        description: `${emoji.command}`,
      }));

      // add selection and disposal functions to quick pick
      quickPick.onDidChangeSelection(([item]) => {
        if (item) {
          editor.edit((edit) => {
            edit.insert(position, String(item.description));
          });
          quickPick.dispose();
        }
      });

      quickPick.onDidHide(() => quickPick.dispose());
      quickPick.show();
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
