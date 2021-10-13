import React, { useEffect } from "react"
import { observer } from "mobx-react-lite"
import { ScrollView } from "react-native"
import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib"
import { provider, useInstance } from "react-ioc"
import { TransactionsScreenViewModel } from "./TransactionsScreenViewModel"
import { BlurWrapper } from "../../../../components/blurWrapper/BlurWrapper"
import { Screen } from "../../../../components"
import { Header } from "../../../../components/header/Header"
import { t } from "../../../../i18n"
import FAIcon from "react-native-vector-icons/FontAwesome5"

const Transactions = observer<{ route: any }>(({ route }) => {
    const view = useInstance(TransactionsScreenViewModel)

    useEffect(() => {
        view.init(route.params)
    }, [])


    return <BlurWrapper
            before={
                <Screen
                        backgroundColor={ Colors.dark70 }
                        statusBarBg={ Colors.dark70 }
                        preset="fixed"

                >
                    <Header title={ t("transactionsScreen.name") }/>

                    { view.initialized &&
                    <ScrollView>
                        <View>
                            {
                              !!view.transactions && !!view.transactions.length && view.transactions.map(i => {
                                    return <View backgroundColor={ Colors.white } paddingV-10 paddingH-20
                                                 key={ i.nonce }>
                                        <View row spread paddingT-5>
                                            <View center flex-1>
                                                <FAIcon size={ 25 } color={ i.statusColor } name={ i.statusIcon }/>
                                            </View>
                                            <View flex-5 paddingL-10>
                                                <View>
                                                    <Text dark30 text70R bold>{ i.actionName }</Text>
                                                </View>
                                                <View>
                                                    <Text dark50>{ `${ i.blockTimestamp.toLocaleDateString() } ${ i.blockTimestamp.toLocaleTimeString() }` }</Text>
                                                </View>
                                            </View>
                                            <View right centerV flex-4>
                                                <Text numberOfLines={1} text70 dark30 bold>{ i.formatValue }</Text>
                                            </View>
                                        </View>

                                    </View>
                                })
                            }
                        </View>
                    </ScrollView>
                    }
                    { !view.initialized && <View flex><LoaderScreen/></View> }
                </Screen>
            }
            after={ <View absB flex row/> }
            isBlurActive={ false }
    />
})

export const TransactionsScreen = provider()(Transactions)
TransactionsScreen.register(TransactionsScreenViewModel)
