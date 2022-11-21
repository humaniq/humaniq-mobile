import { Switch as PaperSwitch } from "react-native-paper"
import { useCallback, useState } from "react"
import { SwitchProps } from "./types"

export const Switch = ({ defaultState, color, onToggle }: SwitchProps) => {
  const [ isSwitchOn, setIsSwitchOn ] = useState(defaultState)

  const onToggleSwitch = useCallback(() => {
    setIsSwitchOn(!isSwitchOn)
    onToggle?.(!isSwitchOn)
  }, [ isSwitchOn, setIsSwitchOn ])

  return (
    <PaperSwitch
      color={ color }
      value={ isSwitchOn }
      onValueChange={ onToggleSwitch }
    />
  )
}
