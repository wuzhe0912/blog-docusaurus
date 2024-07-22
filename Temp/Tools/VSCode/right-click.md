---
id: right-click
title: '📜 Right Click On Windows Folder'
slug: /right-click
---

## Reason

Some files are not opened with Visual Studio Code by default.

When I want to edit with VSCode, I have to open VSCode first and then drag the file to VSCode, which is a bit tedious.

A more convenient way is to add the Open VS Code option to the right-click menu.

## Install

When installing Visual Studio Code, there are two options that ask if you want to add Open VS Code to the right-click menu.

If ignore this option and install it directly, you can add VS Code to the menu in other ways.

## Register

Create a vscode.txt file and paste the following content into vscode.txt.

```js
Windows Registry Editor Version 5.00

[HKEY_CLASSES_ROOT\*\shell\Open with VS Code]
@="Edit with VS Code"
"Icon"="C:\\Program Files\\Microsoft VS Code\\Code.exe,0"

[HKEY_CLASSES_ROOT\*\shell\Open with VS Code\command]
@="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\" \"%1\""

[HKEY_CLASSES_ROOT\Directory\shell\vscode]
@="Open Folder as VS Code Project"
"Icon"="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\",0"

[HKEY_CLASSES_ROOT\Directory\shell\vscode\command]
@="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\" \"%1\""

[HKEY_CLASSES_ROOT\Directory\Background\shell\vscode]
@="Open Folder as VS Code Project"
"Icon"="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\",0"

[HKEY_CLASSES_ROOT\Directory\Background\shell\vscode\command]
@="\"C:\\Program Files\\Microsoft VS Code\\Code.exe\" \"%V\""
```

`C:\\Program Files` this path need to adjust according to your installation location, for example, I installed in D slot, so my path is `D:\\`.

### Change txt name

Then change the name of `vscode.txt` to `VSCodeRightClick.reg`.

Click `VSCodeRightClick.reg` and agree to register, then you can see VS Code in the right click menu.

## Reference

- [Right click on Windows folder and open with Visual Studio Code](https://thisdavej.com/right-click-on-windows-folder-and-open-with-visual-studio-code/)
