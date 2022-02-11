module.exports = {
    "testRunner": "jest",
    "runnerConfig": process.env.DETOX_EXPOSE_GLOBALS === '0' ? 'e2eExplicitRequire/config.json' : 'e2e/config.json',
    "specs": process.env.DETOX_EXPOSE_GLOBALS === '0' ? 'e2eExplicitRequire' : 'e2e',
    "behavior": {
        "init": {
            "exposeGlobals": process.env.DETOX_EXPOSE_GLOBALS !== '0',
        },
    },
    "apps": {
        "android.release": {
            "type": "android.apk",
            "binaryPath": "android/app/build/outputs/apk/release/app-universal-release.apk",
            "testBinaryPath": "android/app/build/outputs/apk/androidTest/release/app-release-androidTest.apk",
            "build": "cd android && gradlew assembleRelease assembleAndroidTest -DtestBuildType=release && cd ..",
        }
    },
    "devices": {
        "emulator": {
            "type": "android.emulator",
            "device": {
                "avdName": "Pixel_XL_API_30"
            },
        },
        "genymotion.emulator.uuid": {
            "type": "android.genycloud",
            "device": {
                "recipeUUID": "bd402826-4ee6-4598-94df-da4f89021042"
            },
        },
        "genymotion.emulator.name": {
            "type": "android.genycloud",
            "device": {
                "recipeName": "Detox_Pixel_XL_API_30"
            },
        }
    },
    "configurations": {
        "android.emu.release": {
            "device": "emulator",
            "app": "android.release",
        },
        "android.genycloud.release": {
            "device": "genymotion.emulator.uuid",
            "app": "android.release",
        }
    }
};