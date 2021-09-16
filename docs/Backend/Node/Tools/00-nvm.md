---
id: 00-nvm
description: NVM Control Node.js version
slug: /nvm
---

# NVM

> 透過 `NVM(Node Version Manager)` 這一工具，管理 `Node` 版本，並記錄如何安裝與切換指令。

## Install NVM

### Mac

使用 `curl` 指令進行安裝。

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

接著重新啟動 `iTerm2`，檢查 `nvm` 版本是否安裝成功。

```bash
nvm --version               # 檢查 nvm 版本號是否正常出現
```

### Windows

前往 Github 的 [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)，下載 nvm-setup.zip 進行解壓縮安裝 (近期有更新 1.1.8 版本，但建議還是採用 1.1.7)
。

![nvm-windows](https://i.imgur.com/uFyhtwx.png)

### check version

```bash
nvm --version
```

## Install Node

安裝完 NVM 後不代表已經完成 Node 的安裝，我們仍須透過 NVM 的指令來安裝 Node。

### command

```bash
nvm ls-remote               # 查看遠端 Node 版本列表(Mac 環境可用指令)

nvm list                    # 查看本地 Node 已安裝版本列表
#or
nvm ls

nvm install 12.22.1         # 安裝指定 Node 版本

nvm use 12.22.1             # 切換到使用的 Node 版本

nvm alias default 12.22.1   # 設定預設使用的 Node 版本
```

安裝完成後檢查版本

![node](https://i.imgur.com/Y9PnGmw.png)

## Error Fixed(Mac)

> 此前進行硬體設備調整時，造成環境跑掉，記錄自己遇到的概況與解法。

打開終端機出現下述 error :

```bash
nvm is not compatible with the npm config “prefix” option: currently set to “/Users/xxx/.nvm/versions/node/v8.12.0"
Run `npm config delete prefix` or `nvm use --delete-prefix v8.12.0 --silent` to unset it.
```

從字面上來看，應該是 `npm` 和 `nvm` 管理的 `node` 版本沒有對上，按照終端機提供的訊息，敲入對應指令。再檢查 `node` 版本似乎是正常了，但事實上，若另開終端機分頁，依然會跳相同的提示錯誤。雖然不影響操作，但看到總是不順眼，`google` 了一下解法，最終測試成功方案如下：

```bash
npm config delete prefix
npm config set prefix $NVM_DIR/versions/node/v8.12.0
```

這段指令的意思是，先刪除 `npm` 中設定的 `prefix`，再重新設定當前 `nvm` 使用的版本。
