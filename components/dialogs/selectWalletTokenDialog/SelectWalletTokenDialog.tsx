import React from "react";
import { useInstance } from "react-ioc";
import { observer } from "mobx-react-lite";
import { FlatList } from "react-native";
import { Colors, Dialog, Text, View } from "react-native-ui-lib";
import { SelectWalletTokenViewModel } from "./SelectWalletTokenViewModel";
import { runInAction } from "mobx";
import { DialogHeader } from "../dialogHeader/DalogHeader";
import { TokenItem } from "../../tokenItem/TokenItem";
import { t } from "../../../i18n";
import { getWalletStore } from "../../../App";

export const SelectWalletTokenDialog = observer(() => {
    const view = useInstance(SelectWalletTokenViewModel)

    return <Dialog
        testID={ 'selectWalletTokenDialog' }
        width={ "100%" }
        height={ 350 }
        visible={ view.display }
        containerStyle={ {
            backgroundColor: Colors.transparent,
            paddingTop: 16,
        } }
        onDismiss={ () => runInAction(() => {
            view.display = false
        }) }
        bottom
    >
        <View flex style={{
            backgroundColor: Colors.bg,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            paddingBottom: 16,
        }}>
            <DialogHeader buttonStyle={{
                marginTop: -18,
                padding: 2,
                paddingHorizontal: 22,
                backgroundColor: Colors.white
            }} onPressIn={ () => {
                view.display = false
            } }/>
            <View padding-16>
                <Text textM>{ t("selectWalletTokenDialog.title") }</Text>
            </View>
            <FlatList
                contentContainerStyle={{
                    backgroundColor: Colors.white,
                    borderRadius: 12,
                    marginLeft: 16,
                    marginRight: 16,
                }}
                data={ view.options }
                keyExtractor={ (item, index) => `token_${ item.symbol }_${ index }` }
                renderItem={ ({ item, index }) => {
                    return <TokenItem key={ index } symbol={ item.symbol } tokenAddress={ item.tokenAddress }
                                      logo={ item?.logo }
                                      name={ item.name }
                                      formatBalance={ item.formatBalance } formatFiatBalance={ item.formatFiatBalance }
                                      index={ index }
                                      onPress={ item.onPress }
                                      fiatOnTop={ getWalletStore().fiatOnTop }
                    />
                }
                }
            />
        </View>
    </Dialog>
})