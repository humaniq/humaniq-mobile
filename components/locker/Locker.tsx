import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { Screen } from "../screen/screen";
import { Colors, LoaderScreen, Text, View } from "react-native-ui-lib";
import { provider, useInstance } from "react-ioc";
import { LockerViewModel } from "./LockerViewModel";
import Ripple from "react-native-material-ripple";
import { t } from "../../i18n";
import Ionicons from "react-native-vector-icons/Ionicons";
import { RootStore } from "../../store/RootStore";
import { reaction } from "mobx";
import { localStorage } from "../../utils/localStorage";

// export interface LockerProps {
//   mode: "set|check";
//   pin?: number;
// }

const L = observer(function(props) {
  
  const view = useInstance(LockerViewModel);
  const store = useInstance(RootStore);
  
  useEffect(() => {
    console.log(store);
    view.init(store);
    
    reaction(() => store.appStore.isLockerActive, async () => {
      view.pin = "";
      view.settledPin = await localStorage.load("pincode");
      view.confirmationPin = "";
      view.step = 0;
      view.message = "";
    });
    
  }, []);
  
  return <Screen backgroundColor={ Colors.primary } statusBarBg={ Colors.primary }>
    { view.initialized && <View flex>
      <View flex-3 bg-red20>
        <Text>
          vvv
        </Text>
      </View>
      <View center flex-1 bg-red20>
        <Text>
          vvv
        </Text>
      </View>
      <View flex-1 />
      <View flex-3>
        {
          [ 1, 2, 3 ].map(col =>
            <View flex row center key={ `col${ col }` }>
              {
                [ 1, 2, 3 ].map(row =>
                  <View key={ `row${ row }` } margin-5 center row>
                    <Ripple rippleColor={ "rgb(0, 0, 102)" }
                            onPress={ () => view.handleClick(`${ (col - 1) * 3 + row }`) }>
                      <View padding-10 flex width={ 80 } center style={ { borderRadius: 40 } }>
                        <Text bg-primary text40BL white>
                          { `${ (col - 1) * 3 + row }` }
                        </Text>
                      </View>
                    </Ripple>
                  </View>
                )
              }
            </View>
          )
        }
        <View flex row center>
          <View margin-5 center row>
            <Ripple rippleColor={ "rgb(0, 0, 102)" }>
              <View padding-10 flex width={ 80 } center style={ { borderRadius: 40 } }>
                <Text bg-primary text80BL white>
                  { t("common.cancel") }
                </Text>
              </View>
            </Ripple>
          </View>
          <View margin-5 center row>
            <Ripple onPress={ () => view.handleClick("0") } rippleColor={ "rgb(0, 0, 102)" }>
              <View padding-10 flex width={ 80 } center style={ { borderRadius: 40 } }>
                <Text bg-primary text40BL white>
                  0
                </Text>
              </View>
            </Ripple>
          </View>
          <View margin-5 center row>
            <Ripple rippleColor={ "rgb(0, 0, 102)" }>
              <View padding-10 flex width={ 80 } center style={ { borderRadius: 40 } }>
                <Text bg-primary white>
                  <Ionicons size={ 25 } name={ "backspace" } />
                </Text>
              </View>
            </Ripple>
          </View>
        </View>
      </View>
    </View> }
    { !view.initialized && <LoaderScreen /> }
  </Screen>;
});

export const Locker = provider()(L);
Locker.register(LockerViewModel);
