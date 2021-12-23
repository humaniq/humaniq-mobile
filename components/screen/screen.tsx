import * as React from "react";
import { Appearance, KeyboardAvoidingView, Platform, RefreshControl, ScrollView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ScreenProps } from "./screen.props";
import { isNonScrolling, offsets, presets } from "./screen.presets";
import { Button, Colors, Text } from "react-native-ui-lib";
import ErrorBoundary from 'react-native-error-boundary'

const isIos = Platform.OS === "ios";

function ScreenWithoutScrolling(props: ScreenProps) {
  const insets = useSafeAreaInsets();
  const preset = presets.fixed;
  const style = props.style || {};
  const backgroundStyle = props.backgroundColor ? { backgroundColor: props.backgroundColor } : { backgroundColor: Colors.bg };
  const insetStyle = { paddingTop: props.unsafe ? 0 : insets.top };

  console.log(props.statusBar)

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
        <View style={ [ preset.inner, style, insetStyle ] }>{ props.children }</View>
      </KeyboardAvoidingView>
  );
}

function ScreenWithScrolling(props: ScreenProps) {
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
        <View style={ [ preset.outer, backgroundStyle, insetStyle ] }>
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
}

const CustomFallback = (props: { error: Error, resetError: () => void }) => (
    <View>
      <Text>Something happened!</Text>
      <Text>{ props.error.toString() }</Text>
      <Button onPress={ props.resetError } label={ 'Try again' }/>
    </View>
)

/**
 * The starting component on every screen in the app.
 *
 * @param props The screen props
 */
export function Screen(props: ScreenProps) {
  if (isNonScrolling(props.preset)) {
    return <ErrorBoundary FallbackComponent={ CustomFallback }><ScreenWithoutScrolling { ...props } /></ErrorBoundary>;
  } else {
    return <ErrorBoundary FallbackComponent={ CustomFallback }><ScreenWithScrolling { ...props } /></ErrorBoundary>;
  }
}
