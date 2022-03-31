import React, { useEffect, useRef } from "react";
import { observer } from "mobx-react-lite";
import {
    Button,
    Colors,
    ExpandableSection,
    LoaderScreen,
    RadioButton,
    Text,
    TextField,
    View
} from "react-native-ui-lib";
import { useInstance } from "react-ioc";
import { SendTransactionViewModel } from "./SendTransactionViewModel";
import { Screen } from "../../../components";
import { t } from "../../../i18n";
import { useNavigation } from "@react-navigation/native";
import { getDictionary, getWalletStore } from "../../../App";
import Ripple from "react-native-material-ripple"
import { RootNavigation } from "../../../navigators";
import { InteractionManager, ScrollView } from "react-native";
import {
    SelectWalletTokenViewModel
} from "../../../components/dialogs/selectWalletTokenDialog/SelectWalletTokenViewModel";
import { Header, ICON_HEADER } from "../../../components/header/Header";
import useKeyboard from '@rnhooks/keyboard';
import { throttle } from "../../../utils/general";
import CameraIcon from "../../../assets/images/camera.svg"
import { HIcon } from "../../../components/icon";

export const SelectAddressScreen = observer<{ route: any }>(({ route }) => {
    const view = useInstance(SendTransactionViewModel)
    const nav = useNavigation()
    const inputRef = useRef()
    const selectWalletTokenView = useInstance(SelectWalletTokenViewModel)

    const [ visible ] = useKeyboard();

    useEffect(() => {
        return () => {
            view.closeDialog()
        }
    }, [])

    useEffect(() => {
        view.init(route.params)
        selectWalletTokenView.init(view.walletAddress)
    }, [])

    // @ts-ignore
    const thr = throttle(() => {
        InteractionManager.runAfterInteractions(() => {
            // @ts-ignore
            inputRef.current?.focus();
        })
    }, 300)

    useEffect(() => {
        try {
            view.registerInput(inputRef)
            // @ts-ignore
            inputRef?.current && thr()
        } catch (e) {
            console.log("ERROR", e)
        }
    }, [ inputRef?.current ])

    return <Screen
        backgroundColor={ Colors.white }
        statusBarBg={ Colors.white }
        style={ { height: "100%" } }
    >
        <Header icon={ ICON_HEADER.CROSS } rightText={ t('selectValueScreen.step') }/>
        { view.initialized && <>
            <View padding-16 testID={ 'selectAddressScreen' }>
                <TextField
                    testID={ 'inputAddress' }
                    autoFocus
                    multiline={ true }
                    selectionColor={ Colors.primary }
                    errorColor={ view.inputAddressError ? Colors.error : Colors.textGrey }
                    validationMessage={ view.inputAddressErrorMessage }
                    onChangeText={ (val) => {
                        view.txData.to = val
                    } }
                    value={ view.txData.to }
                    ref={ inputRef }
                    hideUnderline
                    floatingPlaceholder
                    rightButtonProps={ {
                        iconSource: CameraIcon, // require("../../../assets/images/camera.png"),
                        style: {
                            alignSelf: "center",
                            marginRight: 15,
                        },
                        onPress: () => {
                            nav.navigate("QRScanner", {
                                // @ts-ignore
                                onScanSuccess: meta => {
                                    if (meta.action === "send-eth" && meta.target_address) {
                                        view.txData.to = meta.target_address
                                    }
                                }
                            }, undefined, undefined)
                        }
                    } }
                    floatingPlaceholderStyle={ !view.txData.to ? {
                        left: 15,
                        top: 13,
                        fontFamily: "Roboto-Medium"
                    } : {} }
                    floatingPlaceholderColor={ {
                        focus: Colors.primary,
                        error: Colors.error,
                        default: Colors.primary,
                        disabled: Colors.primary
                    } }
                    placeholder={ "Address" }
                    placeholderTextColor={ Colors.textGrey }
                    style={ {
                        paddingRight: 50,
                        padding: 10,
                        borderRadius: 5,
                        borderColor: view.inputAddressError ? Colors.error : Colors.primary
                    } }
                />
            </View>
            <View bg-bg flex br50>
                <ScrollView>
                    <View paddingH-16 marginB-90>
                        <Text text16 robotoM marginV-24>{ t("selectAddressScreen.transfer") }</Text>
                        { !!getDictionary().recentlyUsedAddresses.items.length && <View marginB-10>
                            <ExpandableSection
                                expanded={ view.recentlyUsedAddresses }
                                onPress={ () => {
                                    view.recentlyUsedAddresses = !view.recentlyUsedAddresses
                                } }
                                sectionHeader={ (() =>
                                    <View bg-white padding-10 br20 row centerV spread>
                                        <Text text16>{ t("selectAddressScreen.toRecentAddress") }</Text>
                                        <Button testID={ 'recentlyUsedAddresses' } link
                                                style={ { height: 30, width: 30 } }
                                                onPress={ () => {
                                                    view.recentlyUsedAddresses = !view.recentlyUsedAddresses
                                                } }
                                        >
                                            { !view.recentlyUsedAddresses &&
                                                <HIcon name={ "down" } width={ 14 }
                                                       style={ { color: Colors.black } }/> }
                                            { view.recentlyUsedAddresses &&
                                                <HIcon name={ "up" } width={ 14 } style={ { color: Colors.black } }/> }
                                        </Button>
                                    </View>)() }
                            >
                                <View
                                    style={ {
                                        borderBottomLeftRadius: 12,
                                        borderBottomRightRadius: 12,
                                        backgroundColor: Colors.white
                                    } }>
                                    {
                                        getDictionary().recentlyUsedAddresses.items.map(w => {
                                            return <View key={ w }>
                                                <View
                                                    style={ {
                                                        borderBottomWidth: 1,
                                                        borderBottomColor: Colors.grey,
                                                        marginLeft: 10
                                                    } }/>
                                                <Ripple testID={ 'recentlyUsedAddress' } onPress={ () => {
                                                    if (view.txData.to === w) {
                                                        view.txData.to = ""
                                                    } else {
                                                        view.txData.to = w
                                                    }
                                                } } rippleColor={ Colors.primary }>
                                                    <View margin-12 row spread paddingR-3>
                                                        <Text
                                                            text16>{ `${ w.slice(0, 4) }...${ w.substring(w.length - 4) }` }</Text>
                                                        <RadioButton size={ 20 }
                                                                     color={ view.txData.to !== w ? Colors.textGrey : Colors.primary }
                                                                     selected={ view.txData.to === w }/>
                                                    </View>
                                                </Ripple></View>
                                        })
                                    }
                                </View>
                            </ExpandableSection>
                        </View> }
                        <ExpandableSection
                            expanded={ view.betweenMyAddress }
                            onPress={ () => {
                                view.betweenMyAddress = !view.betweenMyAddress
                            } }
                            sectionHeader={ (() =>
                                <View bg-white padding-10 br20 row centerV spread>
                                    <Text text16>{ t("selectAddressScreen.betweenMyAddresses") }</Text>
                                    <Button testID={ 'betweenMyAddresses' } link style={ { height: 30, width: 30 } }
                                            onPress={ () => {
                                                view.betweenMyAddress = !view.betweenMyAddress
                                            } }
                                    >
                                        { !view.betweenMyAddress &&
                                            <HIcon name={ "down" } width={ 14 } style={ { color: Colors.black } }/> }
                                        { view.betweenMyAddress &&
                                            <HIcon name={ "up" } width={ 14 } style={ { color: Colors.black } }/> }
                                    </Button>
                                </View>)() }
                        >
                            <View
                                style={ {
                                    borderBottomLeftRadius: 12,
                                    borderBottomRightRadius: 12,
                                    backgroundColor: Colors.white
                                } }>
                                {
                                    getWalletStore().allWallets.map(w => {
                                        return <View key={ w.address }>
                                            <View
                                                style={ {
                                                    borderBottomWidth: 1,
                                                    borderBottomColor: Colors.grey,
                                                    marginLeft: 10
                                                } }/>
                                            <Ripple testID={ 'betweenMyAddress' } onPress={ () => {
                                                if (view.txData.to === w.address) {
                                                    view.txData.to = ""
                                                } else {
                                                    view.txData.to = w.address
                                                }
                                            } } rippleColor={ Colors.primary }>
                                                <View margin-12 row spread paddingR-3>
                                                    <Text text16>{ w.formatAddress }</Text>
                                                    <RadioButton size={ 20 }
                                                                 color={ view.txData.to !== w.address ? Colors.textGrey : Colors.primary }
                                                                 selected={ view.txData.to === w.address }/>
                                                </View>
                                            </Ripple></View>
                                    })
                                }
                            </View>
                        </ExpandableSection>
                    </View>
                </ScrollView>
                <View center row padding-20 bg-bg style={ { width: "100%", paddingBottom: visible ? 8 : 20 } }>
                    <Button testID={ 'nextStep' } disabled={ view.inputAddressError || !view.txData.to }
                            style={ { width: "100%", borderRadius: 12 } }
                            label={ t("selectValueScreen.nextBtn") }
                            onPress={ () => {
                                RootNavigation.navigate("sendTransaction", {
                                    screen: "selectValue"
                                })
                            } }
                    />
                </View>
            </View>
        </> }
        {
            !view.initialized && <LoaderScreen/>
        }
    </Screen>
})