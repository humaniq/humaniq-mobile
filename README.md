## Humaniq Mobile App

- based on React Native
- used Mobx-keystone as state manager
- used mobx for Component view models
- used React-ioc for dependency injection

### Generate key once

- `keytool -genkey -v -keystore humaniqmobile.keystore -alias com.humaniqmobile -keyalg RSA -keysize 2048 -validity 10000`

- `mv humaniqmobile.keystore ./android/app`
- `android\app\build.gradle`
```
    ...
    signingConfigs {
        debug {
            storeFile file('humaniqmobile.keystore')
            storePassword '123456'
            keyAlias 'com.humaniqmobile'
            keyPassword '123456'
        }
        release {
            storeFile file('humaniqmobile.keystore')
            storePassword '123456'
            keyAlias 'com.humaniqmobile'
            keyPassword '123456'
        }
    }
    ...
```

### Troubleshooting

https://stackoverflow.com/questions/53239705/react-native-error-duplicate-resources-android

In this solution you no need to delete any drawable folder. 
Just add the following code in the react.gradle file which you could find under 
node_modules/react-native/react.gradle path

```
    doLast {
        def moveFolderFunc = { folderName ->
            File originalDir = file("$buildDir/generated/res/react/release/${folderName}");
            if (originalDir.exists()) {
                File destDir = file("$buildDir/../src/main/res/${folderName}");
                ant.move(file: originalDir, tofile: destDir);
            }
        }

        moveFolderFunc.curry("drawable-ldpi").call()
        moveFolderFunc.curry("drawable-mdpi").call()
        moveFolderFunc.curry("drawable-hdpi").call()
        moveFolderFunc.curry("drawable-xhdpi").call()
        moveFolderFunc.curry("drawable-xxhdpi").call()
        moveFolderFunc.curry("drawable-mdpi-v4").call()
        moveFolderFunc.curry("drawable-xxxhdpi").call()
        moveFolderFunc.curry("raw").call()
    }

```

- crypto - https://www.npmjs.com/package/react-native-crypto

```
    npm i --save react-native-crypto
    # install peer deps 
    npm i --save react-native-randombytes
    react-native link react-native-randombytes
    # install latest rn-nodeify 
    npm i --save-dev tradle/rn-nodeify
    # install node core shims and recursively hack package.json files 
    # in ./node_modules to add/update the "browser"/"react-native" field with relevant mappings 
    ./node_modules/.bin/rn-nodeify --hack --install

```
