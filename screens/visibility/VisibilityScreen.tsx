import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Colors, LoaderScreen, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { t } from "../../i18n"
import { Header } from "../../components/header/Header"
import { VisibilityScreenViewModel } from "./VisibilityScreenViewModel";

const Visibility = observer(function () {
    const view = useInstance(VisibilityScreenViewModel)

    useEffect(() => {
        view.init()
    }, [])


    return (
        <Screen style={ { minHeight: "100%" } } preset={ "scroll" } backgroundColor={ Colors.bg }
                statusBarBg={ Colors.bg }>
            {
                view.initialized &&
                <>
                    <Header title={ t("visibilityScreen.name") }/>
                    <View testID={ 'visibilityScreen' } flex>

                    </View>
                </>
            }
            {

                !view.initialized && <View flex center><LoaderScreen/></View>
            }
        </Screen>
    )
})

export const VisibilityScreen = provider()(Visibility)
VisibilityScreen.register(VisibilityScreenViewModel)