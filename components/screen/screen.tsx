import * as React from "react";
import { Appearance, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenProps } from "./screen.props";
import { isNonScrolling, offsets, presets } from "./screen.presets";
import { Colors, Text, View as UIView } from "react-native-ui-lib";
import { t } from "../../i18n";
import { getAppStore } from "../../App";
import { observer } from "mobx-react-lite";

const isIos = Platform.OS === "ios";

const ScreenWithoutScrolling = observer((props: ScreenProps) => {
    const insets = useSafeAreaInsets();
    const preset = presets.fixed;
    const style = props.style || {};
    const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : { backgroundColor: Colors.bg };
    const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top };

    return (
        <KeyboardAvoidingView
            style={ [ preset.outer, backgroundStyle ] }
            behavior={ isIos ? "padding" : undefined }
            keyboardVerticalOffset={ offsets[props.keyboardOffset || "none"] }
        >
            <StatusBar
                translucent
                barStyle={ props.statusBar || Appearance.getColorScheme() === "dark" ? "light-content" : "dark-content" }
                backgroundColor={ props.statusBarBg || Colors.bg }/>
            <View testID={ props.testID } style={ [ preset.inner, style, insetStyle ] }>
                {
                    !props.disableConnectionInfo && !getAppStore().isConnected && <UIView bg-error padding-8
                    ><Text white>{ t("appToasts.disconnected") }</Text></UIView>
                }
                { props.children }
            </View>
        </KeyboardAvoidingView>
    );
})

const ScreenWithScrolling = observer((props: ScreenProps) => {
    const insets = useSafeAreaInsets();
    const preset = presets.scroll;
    const style = props.style || {};
    const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : { backgroundColor: Colors.bg };
    const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top };

    const refreshControl = props.onRefresh ? <RefreshControl
        refreshing={ props.refreshing }
        onRefresh={ props.onRefresh }
    /> : null;

    return (
        <KeyboardAvoidingView
            style={ [ preset.outer, backgroundStyle ] }
            behavior={ isIos ? "padding" : undefined }
            keyboardVerticalOffset={ offsets[props.keyboardOffset || "none"] }
        >
            <StatusBar
                translucent
                barStyle={ props.statusBar || Appearance.getColorScheme() === "dark" ? "light-content" : "dark-content" }
                backgroundColor={ props.statusBarBg || Colors.bg }/>
            <View testID={ props.testID } style={ [ preset.outer, backgroundStyle, insetStyle ] }>
                {
                    !props.disableConnectionInfo && !getAppStore().isConnected && <UIView bg-error padding-8
                    ><Text white>{ t("appToasts.disconnected") }</Text></UIView>
                }
                <ScrollView
                    style={ [ preset.outer, backgroundStyle ] }
                    contentContainerStyle={ [ preset.inner, style ] }
                    keyboardShouldPersistTaps={ props.keyboardShouldPersistTaps || "handled" }
                    refreshControl={ refreshControl }
                >
                    { props.children }
                </ScrollView>
            </View>
        </KeyboardAvoidingView>
    );
})

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export const Screen = observer((props: ScreenProps) => {
    if (isNonScrolling(props.preset)) {
        return <ScreenWithoutScrolling { ...props } />;
    } else {
        return <ScreenWithScrolling { ...props } />;
    }
})