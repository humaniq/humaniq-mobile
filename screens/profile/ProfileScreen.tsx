import { observer } from "mobx-react-lite";
import React, {useEffect} from "react";
import {provider, useInstance} from "react-ioc";
import { Screen } from "../../components";

import {ProfileScreenModel} from "./ProfileScreenModel";
import { Colors} from "react-native-ui-lib";
import {SettingsScreenModel} from "../settings/SettingsScreenModel";
import {Header} from "../../components/header/Header";
import * as Animatable from "react-native-animatable";
import {t} from "../../i18n";

const Profile = observer(function () {

    const view = useInstance(ProfileScreenModel)
    useEffect(() => {
        view.init();
    }, []);

    return (
        <Screen preset={ "fixed" } backgroundColor={ Colors.dark70 } statusBarBg={ Colors.dark70 }>
        {
            view.initialized &&
            <Animatable.View animation={ "fadeIn" } style={ { height: "100%" } }>
                <Header title={ t("profileScreen.name") } />

            </Animatable.View>
        }
        </Screen>
    );
})

export const ProfileScreen = provider()(Profile);
ProfileScreen.register(SettingsScreenModel);