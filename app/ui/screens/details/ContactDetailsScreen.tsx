import { ContactDetailsScreenProps } from "./types"
import { useStyles } from "./styles"
import { AppStatusBar } from "ui/components/statusbar/AppStatusBar"
import { SafeArea } from "ui/components/SafeArea"
import React from "react"
import { Header } from "ui/components/header/Header"
import { Text } from "react-native-paper"
import { PrimaryButton } from "ui/components/button/PrimaryButton"
import { LockText } from "ui/components/lock/LockText"
import { Input } from "ui/components/input/Input"

export const ContactDetailsScreen = ({}: ContactDetailsScreenProps) => {
  const styles = useStyles()

  return (
    <>
      <AppStatusBar/>
      <SafeArea style={ styles.root }>
        <Header title={ "Contact details" }/>
        <Text style={ styles.title }>
          Mover doesn’t process or store your data. All your data is securely processed by our licensed and regulated
          card partner Trastra.
        </Text>
        <Input
          containerStyle={ styles.input }
          hint={ "your@email.com" }
          title={ "Your email" }/>
        <Input
          containerStyle={ styles.input }
          title={ "Your phone number" }/>
        <PrimaryButton
          style={ styles.button }
          title={ "Fill out contact info" }
          disabled={ true }/>
        <LockText
          text={ "Your data is securely stored by regulated Partner, not Mover." }/>
      </SafeArea>
    </>
  )
}
