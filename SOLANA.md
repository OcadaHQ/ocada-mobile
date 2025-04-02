Prep the APK

Create a new EAS profile

If you don't have EAS CLI installed:

```
npx yarn global add eas-cli
```

In eas.json, add:

```
"solana": {
    "channel": "production",
    "env": {
    "APP_VARIANT": "production"
    },
    "android": {
    "buildType": "apk"
    }
}
```

Then build:

```
npx eas build -p android --profile solana
```

To sign APK:

Download and install JDK: https://www.oracle.com/java/technologies/downloads/
<!-- https://www.java.com/en/download/manual.jsp -->

<!-- if you're using zsh you may have to add the following:

```
export JAVA_HOME=/Library/Internet\ Plug-Ins/JavaAppletPlugin.plugin/Contents/Home
export PATH=$JAVA_HOME/bin:$PATH
``` -->


```
mkdir solana-keys
cd solana-keys
```

If using git, add solana-keys to .gitignore

Generate keystore (more info: https://stackoverflow.com/questions/3997748/how-can-i-create-a-keystore):

```
keytool -genkey -v -keystore release-key.keystore -alias ocada -keyalg RSA -keysize 2048 -validity 50000
```

Make a note of the alias.


<!-- Sign the APK:

```
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore ../solana-keys/release-key.keystore ../solana-build/solana-v1.32.0.apk ocada

```
https://stackoverflow.com/questions/10930331/how-to-sign-an-already-compiled-apk -->



```
~/Library/Android/sdk/build-tools/35.0.0/apksigner sign --ks ../solana-keys/release-key.keystore --ks-key-alias ocada --out ../solana-build/ocada-v1.32.0-signed.apk ../solana-build/ocada-v1.32.0-unsigned.apk
```

<!-- Download Android Studio, then install with recommended settings.

New Project > No activity 

Change nothing, click finish -->




Solana mobile steps:

Follow the steps at https://docs.solanamobile.com/dapp-publishing/setup

```
corepack enable
corepack prepare pnpm@`npm info pnpm --json | jq -r .version` --activate
```

No need for Java / SDK

Create publishing folder:

```
mkdir publishing
cd publishing

pnpm init
pnpm install --save-dev @solana-mobile/dapp-store-cli
npx dapp-store init
npx dapp-store --help
```

Edit the file, easy.

----

To find Android SDK:

Open Settings > Languages & Frameworks > Android SDK

You will see Android SDK Location

/Users/<username>/Library/Android/sdk

Switch to SDK Tools tab and check if you have Android SDK Command-line tools installed:


You may also need to install AAPT2:

```
sdkmanager "build-tools;build-tools-version"
```

"build-tools-version" should be replaced with the latest version from the release page: https://developer.android.com/tools/releases/build-tools

For example:

```
sdkmanager "build-tools;34.0.0"
```

Alternatively, use a full path

```
~/Library/Android/sdk/cmdline-tools/latest/bin/sdkmanager "build-tools;34.0.0"
```


Create publisher NFT:

```
npx dapp-store create publisher -k ../solana-keys/ocadaZVJsE3chzJ8RD4CMCaM7rubkH6j1tvpuoAm68X.json -u https://api.mainnet-beta.solana.com
```

Create app NFT:
```
npx dapp-store create app -k ../solana-keys/ocadaZVJsE3chzJ8RD4CMCaM7rubkH6j1tvpuoAm68X.json -u https://api.mainnet-beta.solana.com
```

Release:

```
npx dapp-store create release -k ../solana-keys/ocadaZVJsE3chzJ8RD4CMCaM7rubkH6j1tvpuoAm68X.json -u https://api.mainnet-beta.solana.com -a 
```