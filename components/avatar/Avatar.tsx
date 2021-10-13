import React, { memo } from "react";
import { Avatar as Av, AvatarProps as AvProps } from "react-native-ui-lib";
import Jazzicon from 'react-native-jazzicon'


export interface AvatarProps extends AvProps {
  address?: string
}

// eslint-disable-next-line react/display-name
export const Avatar = memo<AvatarProps>(props => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (props.source.uri) return <Av { ...props } />
  if (!props.address) return null
  return <Jazzicon size={ props.size } address={ props.address }/>
})