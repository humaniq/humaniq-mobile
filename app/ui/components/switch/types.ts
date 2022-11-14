export interface SwitchProps {
  defaultState?: boolean
  color?: string
  onToggle?: (toggleState: boolean) => void
}
