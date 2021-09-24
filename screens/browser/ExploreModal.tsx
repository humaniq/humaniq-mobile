import React from "react"
import { Button, Colors, Image, Modal, Text, TouchableOpacity, View } from "react-native-ui-lib"
import { observer } from "mobx-react-lite"
import { useInstance } from "react-ioc"
import { ExploreModalViewModel } from "./ExploreModalViewModel"
import { t } from "../../i18n"
import Ripple from "react-native-material-ripple"
import FAIcon from "react-native-vector-icons/FontAwesome5"
import { BrowserScreenViewModel } from "./BrowserScreenViewModel"

export const ExploreModal = observer(() => {
    const view = useInstance(ExploreModalViewModel)
    const browserView = useInstance(BrowserScreenViewModel)

    return <Modal
            animationType={ "slide" }
            visible={ view.display }>
        <View bg-primar padding-20 right style={ { borderBottomWidth: 1, borderBottomColor: Colors.dark70 } }>
            <Button link onPress={ () => {
                view.display = false
            } }
                    label={ t("common.cancel") }
            />
        </View>
        <View flex>
            { view.tabsArr.map((t, i) => {
                return <TouchableOpacity activeBackgroundColor={ Colors.violet60 } key={ i }
                                         onPress={ () => {
                                             const result = browserView.go(t.url)
                                             if (result) {
                                                 view.selectedTab = i
                                             }
                                             view.display = false
                                         } }>
                    <View
                            row
                            paddingH-20 paddingV-5>
                        <View flex-1 center>
                            { !!t.icon &&
                            <Image marginR-4 height={ 32 } width={ 32 }
                                   style={ { height: 32, width: 32 } }
                                   source={ { uri: t.icon } }/> }
                        </View>
                        <View flex-7 paddingL-10>
                            <View row>
                                <Text bold numberOfLines={ 1 } primary>{ t.title }</Text>
                            </View>
                            <View row>
                                <Text grey30 numberOfLines={ 1 }>{ t.url }</Text>
                            </View>
                        </View>
                        <View flex-2 right>
                            <Ripple onPress={ () => {
                                view.tabs.splice(i, 1)
                                if (view.selectedTab === i) {
                                    browserView.go(browserView.initialUrl)
                                    view.display = false
                                }
                            } }
                                    style={ { padding: 10 } }
                                    rippleContainerBorderRadius={ 20 }
                                    rippleColor={ Colors.primary }>
                                <FAIcon style={ { color: Colors.dark30 } } size={ 20 } name={ "times-circle" }/>
                            </Ripple>
                        </View>
                    </View>
                </TouchableOpacity>
            }) }
        </View>
    </Modal>
})
