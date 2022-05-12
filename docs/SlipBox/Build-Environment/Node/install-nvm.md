---
id: install-nvm
title: '📜 Install NVM'
slug: /install-nvm
---

## Node Version Manager

Use nvm control node version, record how to use command install and switch version.

### Mac

Use `curl` command to install.

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
```

Now, restart `iTerm2`, check nvm is the install successful.

```bash
nvm --version               # check nvm version number
```

### Windows

Github [nvm-windows](https://github.com/coreybutler/nvm-windows/releases)，download `nvm-setup.zip` and unzip to install.

Last version is v1.1.8, but I use v1.1.7.

![nvm-windows](https://i.imgur.com/uFyhtwx.png)

### Check version

```bash
nvm --version
```

## Install Node.js

When we after install nvm, just can use nvm command to install node.

### command

```bash
nvm ls-remote               # check remote node version list(Mac only)

nvm list                    # check local node installed list
#or
nvm ls

nvm install 12.22.1         # install node version

nvm use 12.22.1             # switch node version

nvm alias default 12.22.1   # setting default node version
```

Check node version.

![node](https://i.imgur.com/Y9PnGmw.png)

## Error Fixed(Mac)

Previously, when I adjusted the hardware equipment, lead to environment an error. Record at that time situation and solution.

When open terminal, can seen the error like this :

```bash
nvm is not compatible with the npm config “prefix” option: currently set to “/Users/xxx/.nvm/versions/node/v8.12.0"
Run `npm config delete prefix` or `nvm use --delete-prefix v8.12.0 --silent` to unset it.
```

From the meanings of error text, should be npm is not match with nvm control version.

According to terminal provide support message to enter command, and check node version, seem like normal.

In fact, if open terminal new tab, still seen same error, so I use the following solution :

```bash
npm config delete prefix
npm config set prefix $NVM_DIR/versions/node/v8.12.0
```

This command mean is delete `npm` setting prefix, re setting and use `nvm` control version.

Now, open new tab can seen is normal.
