# Pre-release

Update app.json / app.config.js:

* expo.version: increment minor version by 1
* expo.android.versionCode: increment by 1
* expo.ios.buildNumber: reset to 1

```
npx eas-cli whoami
```

```
#Detect unused dependencies
npx depcheck
```

```
#Remove unused dependencies
yarn remove my-unused-dependency
```

```
# Update dependencies
yarn upgrade --latest
```

# Release day plan

## Compile the development build

```
# iOS simulator
npx eas-cli build --profile development-simulator --platform ios

# Or, a trusted iOS device
npx eas-cli build --profile development --platform ios

Or, a trusted Android device
npx eas-cli build --profile development --platform android
```

When the build has completed, scan the QR code with your phone camera.

Source: [Expo: Creating Development Builds](https://docs.expo.dev/development/build/)

## Install the build and run the app

Then run:

```
npx expo start --dev-client
```

Source: [Expo: Creating Development Builds](https://docs.expo.dev/development/build/)

## Test plan

1. On iOS, go to Settings > Privacy & Security > Developer mode and enable it. Your phone will require a restart. Apple claims that security of the phone will be reduced, so make sure to disable the Developer mode after you've completed the tests. 
2. Complete the onboarding. Logout if needed
3. View and scroll down the portfolio
4. Visit the community
5. Tap on any character
6. Buy the stock they own
7. Sell the stock
8. Delete your account
9. Go to Settings > Privacy & Security > Developer mode and disable it.


## Make necessary changes

Major bugs have to be fixed before the production release. This includes crashes, incorrect or missing dependencies etc.

Minor issues, like typos, may be fixed over-the-air without requiring to rebuild the app.

## Create the production build


```
# Build for iOS
npx eas-cli build --platform ios
```

```
# Submit to App Store
npx eas-cli submit -p ios --latest
```

```
# Build for Android
npx eas-cli build --platform android
```

```
# Submit to Google Play
npx eas-cli submit -p android --latest
```

```
npx eas build -p android --profile solana
```

## Post-release

Tag the release

```
git tag v1.x.x
```

Pull request into main.

# Quick release (EAS Update)

```
npx eas-cli update
```

Then select `production` to deploy to the live environment