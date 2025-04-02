# Ocada: mobile app

## Development environment set-up

Find the docs at `/docs/dev-env-setup.md`.

## Install pre-requisites

```
npx yarn install
npx yarn global add eas-cli
```

## Develop & run

Launch Expo:

```
npx expo start --dev-client
```

or ```npx expo start``` for Expo Go client.

MacOS: to run it on Android, use an Android device with Expo Go installed, or launch an AVD from Android Studio. iOS simulator will launch on demand.

Windows: to run a iOS simulation, you need access to an iOS device with Expo Go installed.

If something isn't working, or you've installed a lot of new dependencies, clear cache and launch Expo:

```
npx expo start -c
```

## Dependencies

We use [Yarn](https://yarnpkg.com/)

### Why do we need package X

- `expo-dev-client`: used for development and testing; allows for creating a 'dev build' installed in parallel with the main app on your phone
- `react-native-graph` and `react-native-linear-gradient`: used for chart functionality
- `@react-native-firebase/app`, `expo-build-properties` (required to use useFramework): analytics, push notifications
- `react-native-reanimated`, `react-native-gesture-handler` are peer dependencies for `react-native-ui-lib`

### Update dependencies

Check outdated dependencies:

```
npx yarn outdated
```

### Updating Expo SDK

Generally the process to update the Expo SDK well documented in [Expo blog](https://blog.expo.dev/).

## Common issues

### Invariant violation

Error message:

```
Invariant violation: Tried to register two views with the same name...
``` 

Can often be resolved by running `npx expo upgrade`. It's best to run it along with `npx yarn upgrade`.

## Dependencies ref
- tweetnacl and bs58 are used for connecting phantom