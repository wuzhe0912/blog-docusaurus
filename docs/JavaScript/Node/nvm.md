---
id: nvm
description: NVM 控管 Node.js 版本
slug: /nvm
---

# NVM

> 記錄 `NVM` 如何安裝與切換 `Node.js` 版本指令。

## Install

### Mac

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

接著重新啟動 `iTerm2`，檢查 `nvm` 版本是否安裝成功。

```bash
nvm --version               # 檢查 node 版本是否安裝成功
```

### Windows

[nvm-windows](https://github.com/coreybutler/nvm-windows/releases/tag/1.1.7)，下載 `nvm-setup.zip` 進行解壓縮安裝。

### check version

```bash
nvm --version
```

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
