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
