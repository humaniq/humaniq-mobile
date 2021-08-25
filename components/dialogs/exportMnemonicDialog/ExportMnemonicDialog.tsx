import { Chip, Colors, Dialog, LoaderScreen, Text, View } from "react-native-ui-lib"
import { runInAction } from "mobx"
import React from "react"
import { useInstance } from "react-ioc"
import { observer } from "mobx-react-lite"
import { ExportMnemonicDialogViewModel } from "./ExportMnemonicDialogViewModel"
import { t } from "../../../i18n"
import { DialogHeader } from "../dialogHeader/DalogHeader"

export const ExportMnemonicDialog = observer(() => {
    const view = useInstance(ExportMnemonicDialogViewModel)

    return <Dialog
            width={ "100%" }
            containerStyle={ { backgroundColor: Colors.grey80, borderTopLeftRadius: 30, borderTopRightRadius: 30 } }
            onDismiss={ () => runInAction(() => view.display = false) }
            visible={ view.display }
            bottom
    >
        <View>
            <DialogHeader onPressIn={ () => view.display = false }/>
            { !view.pending &&
            <View style={ { flexWrap: "wrap" } } center row padding-20>
                {
                    view.recoveryPhrase.map((i, id) => <Chip margin-5 padding-6
                                                             useCounter
                                                             badgeProps={ {
                                                                 label: id + 1
                                                             } }
                                                             labelStyle={ {
                                                                 fontSize: 16,
                                                                 lineHeight: 18,
                                                                 color: Colors.white
                                                             } }
                                                             containerStyle={ {
                                                                 borderColor: Colors.violet40,
                                                                 backgroundColor: Colors.violet40
                                                             } }
                                                             key={ i }
                                                             label={ `${ i }` }/>
                    )
                }
            </View>
            }
            <View padding-20 paddingT-0 center>
                <Text>
                    { t("exportMnemonicDialog.description") }
                </Text>
            </View>
            {
                view.pending &&
                <View marginH-30 marginV-10 height={ 200 }><LoaderScreen color={ Colors.grey20 }/></View>
            }
        </View>
    </Dialog>
})
