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

## Troubleshooting

### `xcodebuild` fails on "[CP] Embed Pods Frameworks"

If the build fails with something like:

```
PhaseScriptExecution [CP]\ Embed\ Pods\ Frameworks ...
warning: Stale file '.../__preview.dylib' is located outside of the allowed root paths.
```

This is Xcode's "User Script Sandboxing" (introduced in Xcode 15) blocking
CocoaPods' embed script from writing outside its declared sandbox. It
affects any fresh Xcode 15+/16+ install and isn't specific to this repo or
machine — you will hit it on a clean checkout too. Fix: in Xcode, select
the top-level **DetoxAcademy** project (not a target) → **Build Settings**
→ search **User Script Sandboxing** → set to **No** for both Debug and
Release. Clean and rebuild.

### Codesign fails with "resource fork, Finder information, or similar detritus not allowed"

Usually points at `hermes.framework` specifically. Some pod downloads pick
up extended attributes (`com.apple.FinderInfo`, `com.apple.fileprovider.fpfs`)
that `codesign` refuses to sign — often from iCloud Drive sync or a similar
File Provider service touching files under `Pods/` after `pod install`.
Not guaranteed to happen on every machine, but if you see this error:

```bash
xattr -cr ios/Pods/hermes-engine
xattr -cr ios/build   # or your DerivedData path, if you've already tried building
```

Then rebuild. If it recurs on every build, check whether the project
folder itself is under iCloud Drive ("Desktop & Documents Folders" sync) —
moving the checkout outside any synced folder usually resolves it for good.

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
