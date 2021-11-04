import React, { useEffect, useRef, useState } from "react";
import { BackHandler } from "react-native";
import { NavigationContainerRef, NavigationState, PartialState } from "@react-navigation/native";

export const RootNavigation = {
  navigate(name: string, params?: any) {
    name; // eslint-disable-line no-unused-expressions
  },
  goBack() {
  }, // eslint-disable-line @typescript-eslint/no-empty-function
  resetRoot(state?: PartialState<NavigationState> | NavigationState) {
  }, // eslint-disable-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  getRootState(): NavigationState {
    return {} as any;
  },
  dispatch(action: any): any {
  }
};

export const setRootNavigation = (ref: React.RefObject<NavigationContainerRef>) => {
  for (const method in RootNavigation) {
    RootNavigation[method] = (...args: any) => {
      if (ref.current) {
        return ref.current[method](...args);
      }
    };
  }
};

/**
 * Gets the current screen from any navigation state.
 */
export function getActiveRouteName(state: NavigationState | PartialState<NavigationState>) {
  const route = state.routes[state.index];

  // Found the active route -- return the name
  if (!route.state) return route.name;

  // Recursive call to deal with nested routers
  return getActiveRouteName(route.state);
}

/**
 * Hook that handles Android back button presses and forwards those on to
 * the navigation or allows exiting the app.
 */
export function useBackButtonHandler(
    ref: React.RefObject<NavigationContainerRef>,
    canExit: (routeName: string) => boolean
) {
  const canExitRef = useRef(canExit);

  useEffect(() => {
    canExitRef.current = canExit;
  }, [ canExit ]);

  useEffect(() => {
    // We'll fire this when the back button is pressed on Android.
    const onBackPress = () => {
      const navigation = ref.current;

      if (navigation == null) {
        return false;
      }

      // grab the current route
      const routeName = getActiveRouteName(navigation.getRootState());

      // are we allowed to exit?
      if (canExitRef.current(routeName)) {
        // let the system know we've not handled this event
        return false;
      }

      // we can't exit, so let's turn this into a back action
      if (navigation.canGoBack()) {
        navigation.goBack();

        return true;
      }

      return false;
    };

    // Subscribe when we come to life
    BackHandler.addEventListener("hardwareBackPress", onBackPress);

    // Unsubscribe when we're done
    return () => BackHandler.removeEventListener("hardwareBackPress", onBackPress);
  }, [ ref ]);
}

function toArray(val) {
  return Object.prototype.toString.call(val) !== "[object Array]" ? [ val ] : val;
}

/**
 * Custom hook for persisting navigation state.
 */
export function useNavigationPersistence(storage: any, persistenceKey: string) {
  const [ initialNavigationState ] = useState();
  const [ isRestoringNavigationState, setIsRestoringNavigationState ] = useState(true);

  const routeNameRef = useRef();
  const onNavigationStateChange = (state) => {
    const previousRouteName = routeNameRef.current;
    const currentRouteName = getActiveRouteName(state);

    if (previousRouteName !== currentRouteName) {
      // track screens.
      __DEV__ && console.log(currentRouteName);
    }

    // Save the current route name for later comparision
    routeNameRef.current = currentRouteName;

    // Persist state to localStorage
    storage.save(persistenceKey, state);
  };

  const restoreState = async () => {
    try {
      // const state = await storage.load(persistenceKey);
      // if (state) setInitialNavigationState(state);
    } finally {
      setIsRestoringNavigationState(false);
    }
  };

  useEffect(() => {
    if (isRestoringNavigationState) restoreState();
  }, [ isRestoringNavigationState ]);

  return { onNavigationStateChange, restoreState, initialNavigationState };
}


export function formatRoute(routePath, params) {

  const reRepeatingSlashes = /\/+/g; // "/some//path"
  const reSplatParams = /\*{1,2}/g;  // "/some/*/complex/**/path"
  const reResolvedOptionalParams = /\(([^:*?#]+?)\)/g; // "/path/with/(resolved/params)"
  const reUnresolvedOptionalParams = /\([^:?#]*:[^?#]*?\)/g; // "/path/with/(groups/containing/:unresolved/optional/:params)"
  const reUnresolvedOptionalParamsRR4 = /(\/[^\/]*\?)/g; // "/path/with/groups/containing/unresolved?/optional/params?"
  const reTokens = /<(.*?)>/g;
  const reSlashTokens = /_!slash!_/g;

  let tokens = {};

  if (params) {
    for (let paramName in params) {
      if (params.hasOwnProperty(paramName)) {
        let paramValue = params[paramName];

        if (paramName === "splat") { // special param name in RR, used for "*" and "**" placeholders
          paramValue = toArray(paramValue); // when there are multiple globs, RR defines "splat" param as array.
          let i = 0;
          routePath = routePath.replace(reSplatParams, (match) => {
            let val = paramValue[i++];
            if (val == null) {
              return "";
            } else {
              let tokenName = `splat${ i }`;
              tokens[tokenName] = match === "*"
                  ? encodeURIComponent(val)
                  // don't escape slashes for double star, as "**" considered greedy by RR spec
                  : encodeURIComponent(val.toString().replace(/\//g, "_!slash!_")).replace(reSlashTokens, "/");
              return `<${ tokenName }>`;
            }
          });
        } else {
          // Rougly resolve all named placeholders.
          // Cases:
          // - "/path/:param"
          // - "/path/(:param)"
          // - "/path(/:param)"
          // - "/path(/:param/):another_param"
          // - "/path/:param(/:another_param)"
          // - "/path(/:param/:another_param)"
          const paramRegex = new RegExp("(\/|\\(|\\)|^):" + paramName + "(\/|\\)|\\(|$)");
          routePath = routePath.replace(paramRegex, (match, g1, g2) => {
            tokens[paramName] = encodeURIComponent(paramValue);
            return `${ g1 }<${ paramName }>${ g2 }`;
          });
          const paramRegexRR4 = new RegExp("(.*):" + paramName + "\\?(.*)");
          routePath = routePath.replace(paramRegexRR4, (match, g1, g2) => {
            tokens[paramName] = encodeURIComponent(paramValue);
            return `${ g1 }<${ paramName }>${ g2 }`;
          });
        }
      }
    }
  }

  return routePath
      // Remove braces around resolved optional params (i.e. "/path/(value)")
      .replace(reResolvedOptionalParams, "$1")
      // Remove all sequences containing at least one unresolved optional param
      .replace(reUnresolvedOptionalParams, "")
      // Remove all sequences containing at least one unresolved optional param in RR4
      .replace(reUnresolvedOptionalParamsRR4, "")
      // After everything related to RR syntax is removed, insert actual values
      .replace(reTokens, (match, token) => tokens[token])
      // Remove repeating slashes
      .replace(reRepeatingSlashes, "/")
      // Always remove ending slash for consistency
      .replace(/\/+$/, "")
      // If there was a single slash only, keep it
      .replace(/^$/, "/");
}
