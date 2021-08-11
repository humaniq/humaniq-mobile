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
- rm -rf ./android/app/src/main/res/drawable-*cd
- rm -rf ./android/app/src/main/res/raw
- cd ./android && ./gradlew clean

https://stackoverflow.com/questions/53239705/react-native-error-duplicate-resources-android

In this solution you no need to delete any drawable folder. 
Just add the following code in the react.gradle file which you could find under 
node_modules/react-native/react.gradle path

```
    doLast {
        def moveFunc = { resSuffix ->
            File originalDir = file("$buildDir/generated/res/react/release/drawable-${resSuffix}");
            if (originalDir.exists()) {
                File destDir = file("$buildDir/../src/main/res/drawable-${resSuffix}");
                ant.move(file: originalDir, tofile: destDir);
            }
        }
        moveFunc.curry("ldpi").call()
        moveFunc.curry("mdpi").call()
        moveFunc.curry("hdpi").call()
        moveFunc.curry("xhdpi").call()
        moveFunc.curry("xxhdpi").call()
        moveFunc.curry("xxxhdpi").call()
    }

```
