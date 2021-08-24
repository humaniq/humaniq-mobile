import { observer } from "mobx-react-lite";
import React, {useEffect} from "react";
import {provider, useInstance} from "react-ioc";
import { Screen } from "../../components";

import {ProfileScreenModel} from "./ProfileScreenModel";
import {Colors, Text, View} from "react-native-ui-lib";
import {SettingsScreenModel} from "../settings/SettingsScreenModel";
import {Header} from "../../components/header/Header";
import * as Animatable from "react-native-animatable";
import {t} from "../../i18n";
import {RootStore} from "../../store/RootStore";
import {Image} from "react-native";

const Profile = observer(function () {
    const store = useInstance(RootStore)

    const view = useInstance(ProfileScreenModel)
    useEffect(() => {
        view.init(store);
    }, [])

    return (
        <Screen preset={ "fixed" } backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }>
        {
            view.initialized  &&
            <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                <Header title={ t("profileScreen.name") } />
                <View flex>
                    <Text left h6 bold>{ t("profileScreen.photo") }</Text>
                    <Image source={store.profileStore.photoUrl}/>
                </View>
                <View flex>
                    <Text left h6 bold>{ t("profileScreen.email") }</Text>
                    <Text right>{ store.profileStore.email }</Text>

                </View>
                <View flex>
                    <Text left h6 bold>{ t("profileScreen.fullName") }</Text>
                    <Text right>{ store.profileStore.fullName }</Text>
                </View>
            </Animatable.View>
        }
        </Screen>
    );
})

export const ProfileScreen = provider()(Profile);
ProfileScreen.register(SettingsScreenModel);
