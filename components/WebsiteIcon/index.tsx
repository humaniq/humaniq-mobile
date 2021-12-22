import React, { PureComponent } from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getHost } from "../../utils/browser";
import { Colors } from "react-native-ui-lib";

const styles = StyleSheet.create({
  fallback: {
    alignContent: 'center',
    backgroundColor: Colors.bg,
    borderRadius: 27,
    height: 54,
    justifyContent: 'center',
    width: 54,
  },
  fallbackText: {
    color: Colors.white,
    fontSize: 24,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});


export interface IWebsiteIconProps {
  style?: any,
  viewStyle?: any
  textStyle?: any
  title?: string
  url: string
  transparent?: boolean
  icon?: string
}

/**
 * View that renders a website logo depending of the context
 */
export default class WebsiteIcon extends PureComponent<IWebsiteIconProps> {

  state = {
    renderIconUrlError: false,
  };

  /**
   * Get image url from favicon api
   */
  getIconUrl = (url) => {
    const iconUrl = `https://api.faviconkit.com/${ getHost(url) }/64`;
    console.log(iconUrl)
    return iconUrl;
  };

  /**
   * Sets component state to renderIconUrlError to render placeholder image
   */
  onRenderIconUrlError = async () => {
    await this.setState({ renderIconUrlError: true });
  };

  render = () => {
    const { renderIconUrlError } = this.state;
    const { viewStyle, style, textStyle, url, icon } = this.props;
    const apiLogoUrl = { uri: icon || this.getIconUrl(url) };
    const title = typeof this.props.title === 'string' ? this.props.title.substr(0, 1) : getHost(url).substr(0, 1);

    if (renderIconUrlError && title) {
      return (
          <View style={ viewStyle }>
            <View style={ [ styles.fallback, style ] }>
              <Text style={ [ styles.fallbackText, textStyle ] }>{ title }</Text>
            </View>
          </View>
      );
    }

    return (
        <View style={ viewStyle }>
          <Image source={ apiLogoUrl } style={ style } onError={ this.onRenderIconUrlError }/>
        </View>
    );
  };
}
