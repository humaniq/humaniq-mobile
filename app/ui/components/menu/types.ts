import { noop } from "utils/common"

export interface MenuItemProps {
  icon: string
  title: string
  subTitle: string
  arrowRight?: boolean
  comingSoon?: boolean
  onPress?: typeof noop
}
