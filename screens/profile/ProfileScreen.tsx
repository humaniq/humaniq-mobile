import { observer } from "mobx-react-lite"
import React, { useEffect } from "react"
import { provider, useInstance } from "react-ioc"
import { Screen } from "../../components"

import { ProfileScreenModel } from "./ProfileScreenModel"
import { Button, Colors, TextField, View } from "react-native-ui-lib"
import { Header } from "../../components/header/Header"
import * as Animatable from "react-native-animatable"
import { t } from "../../i18n"
import { RootStore } from "../../store/RootStore"
import { useNavigation } from "@react-navigation/native"
import { runUnprotected } from "mobx-keystone"

const Profile = observer(function () {
    const store = useInstance(RootStore)
    const nav = useNavigation()

    const view = useInstance(ProfileScreenModel)
    useEffect(() => {
        view.init()
        console.log(store.profileStore.email)
    }, [])

    return (
            <Screen preset={ "fixed" } backgroundColor={ Colors.grey70 } statusBarBg={ Colors.grey70 }>
                {
                    view.initialized && store.profileStore.initialized &&
                    <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                        <Header title={ t("profileScreen.name") }/>
                        <View padding-20>
                            <TextField
                                    autoCompleteType={ "email" }
                                    floatingPlaceholder value={ store.profileStore.email } placeholder={ "Email" }
                                    onChangeText={ (val) => {
                                        runUnprotected(() => {
                                            store.profileStore.email = val
                                        })
                                    } }
                            />
                            <TextField floatingPlaceholder value={ store.profileStore.firstName }
                                       placeholder={ "First name" }
                                       autoCompleteType={ "name" }
                                       onChangeText={ (val) => {
                                           runUnprotected(() => {
                                               store.profileStore.firstName = val
                                               console.log(store.profileStore.firstName)
                                           })
                                       } }
                            />
                            <TextField floatingPlaceholder value={ store.profileStore.lastName }
                                       placeholder={ "Second name" }
                                       onChangeText={ (val) => {
                                           runUnprotected(() => {
                                               store.profileStore.lastName = val
                                           })
                                       } }
                            />
                        </View>
                        <View flex bottom>
                            <Button fullWidth onPress={ async () => {
                                await store.profileStore.update({
                                    email: store.profileStore.email,
                                    first_name: store.profileStore.firstName,
                                    last_name: store.profileStore.lastName
                                })
                                // await store.authStore.login(store.walletStore.allWallets[0].address)
                                nav.goBack()
                            } } label={ t("common.save") }/>
                        </View>
                    </Animatable.View>
                }
            </Screen>
    )
})

export const ProfileScreen = provider()(Profile)
ProfileScreen.register(ProfileScreenModel)
