import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Card, Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { Screen } from "../../components"
import { t } from "../../i18n"
import { Header } from "../../components/header/Header"
import { VisibilityScreenViewModel } from "./VisibilityScreenViewModel";
import { TokenItem } from "../../components/tokenItem/TokenItem";

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
                    <View testID={ 'visibilityScreen' } flex paddingH-16>
                        <View row paddingT-20>
                            <Text text16
                                  robotoM>{ `${ t("visibilityScreen.totalTokens") }: ${ view.countTokens }` }</Text>
                        </View>
                        <View row spread paddingT-10>
                            <View row backgroundColor={ Colors.rgba(Colors.primary, 0.07) }
                                  width={ "48%" } br40 paddingH-8 paddingV-4 centerV>
                                <View style={ {
                                    borderRadius: 14,
                                    width: 28,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: Colors.rgba(Colors.primary, 0.14)
                                } }>
                                    <Text text14 robotoM color={ Colors.primary }>{ view.visibleTokensCount }</Text>
                                </View>
                                <Text marginL-4 text12>{ t("visibilityScreen.visibleTokens") }</Text>
                            </View>
                            <View row backgroundColor={ Colors.rgba(Colors.textGrey, 0.07) }
                                  width={ "48%" } br40 paddingH-8 paddingV-4 centerV>
                                <View style={ {
                                    borderRadius: 14,
                                    width: 28,
                                    height: 28,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    backgroundColor: Colors.rgba(Colors.textGrey, 0.14)
                                } }>
                                    <Text text14 robotoM color={ Colors.textGrey }>{ view.invisibleTokensCount }</Text>
                                </View>
                                <Text marginL-4 text12>{ t("visibilityScreen.invisibleTokens") }</Text>
                            </View>
                        </View>
                        <View paddingT-10 paddingB-16>
                            <Card>
                                { view.tokensList.map((t, i) => <TokenItem showRadioBtn={ true } hidden={ t.hidden }
                                                                           key={ t.symbol }
                                                                           onPressRadioBtn={ (v) => {
                                                                               console.log(v)
                                                                               t.toggleHide()
                                                                           }
                                                                           }
                                                                           name={ t.name } logo={ t.logo }
                                                                           tokenAddress={ t.tokenAddress }
                                                                           symbol={ t.symbol } index={ i }/>) }
                            </Card>
                        </View>
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