# go2play

> A native application built with NativeScript-Vue

## Usage

``` bash
# Install dependencies
npm install

# Build for production
tns build <platform> --bundle

# Build, watch for changes and debug the application
tns debug <platform> --bundle

# Build, watch for changes and run the application
tns run <platform> --bundle

## important for iOS
Server must be listed on `<key>NSExceptionDomains</key>` in app/App_Resources/iOS/Info.plist
### deploy to iOS Hardware Device
- first, you need an Apple ID
- get the Apple ID registered with Olivier (I4MI)
- follow this instructions: https://nativescript.nl/tips/how-to-test-your-nativescript-app-on-a-real-ios-device/
```

## Local Storage
Overview over the variables in Local Storage
- name: the user's name
- steps: the number of steps on this day
- lastCheckedSteps: date when the total steps where last checked
- connected: Google Health / Healthkit is connected
