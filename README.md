# Detox Academy

A React Native (iOS + Android) practice app built to teach end-to-end
testing. Sign in, land on a menu of "lessons," and each lesson is a
self-contained screen exercising a different common UI pattern: forms,
lists, modals, gestures, tab and stack navigation, deep linking, animated
and asynchronous states, and an embedded WebView.

Every interactive element carries a stable `testID` (and often an
`accessibilityLabel`/`accessibilityRole` too), on purpose — this app is
meant to be **driven by an automation framework**, not just used by hand.

## What's here

```
App.tsx                      — providers (theme/auth) + navigation root
src/
  screens/                   — one file per lesson
    tabs/                    — the three screens nested inside the Tabs lesson
  navigation/                 — stack navigator + the lesson list/menu data
  context/                   — AuthContext (fake login), ThemeContext (light/dark)
  components/                 — shared Screen/Button/Header building blocks
android/, ios/                — standard React Native native projects
```

## Signing in

There's no real backend — `AuthContext` fakes a short network round trip.
Any non-empty username with a password of 4+ characters works. Two special
cases exist on purpose:

- username `locked` → shows an account-locked error
- password shorter than 4 characters → shows a validation error

## Running it

```bash
npm install
```

### iOS

```bash
bundle install        # first time only
bundle exec pod install --project-directory=ios
npm run ios
```

### Android

Have an emulator booted (or a device connected), then:

```bash
npm run android
```

## Deep linking

The app registers the `detoxacademy://` URL scheme and maps routes to
lessons via React Navigation's `linking` config (see
`src/navigation/RootNavigator.tsx`) — e.g. `detoxacademy://lesson/forms`.
Note that every lesson route only exists once you're signed in.

## This app is course material

This repo intentionally does **not** include any test automation
tooling or test files — no `.detoxrc.js`, no `e2e/` folder, no test
runner wired into the native projects. If you're following along with a
course built around this app, adding that setup yourself — and then
writing your own tests against the screens here — is part of the
exercise.
