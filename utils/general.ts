import { camelCase } from "change-case"

export const tlc = str => str?.toLowerCase?.()

/**
 * Fetch that fails after timeout
 *
 * @param url - Url to fetch
 * @param options - Options to send with the request
 * @param timeout - Timeout to fail request
 *
 * @returns - Promise resolving the request
 */
export function timeoutFetch(url, options, timeout = 500) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), timeout))
  ])
}

export function findRouteNameFromNavigatorState(routes) {
  let route = routes?.[routes.length - 1]
  if (route.state) {
    route = route.state
  }
  while (route !== undefined && route.index !== undefined) {
    route = route?.routes?.[route.index]
    if (route.state) {
      route = route.state
    }
  }

  let name = route?.name

  // For compatibility with the previous way on react navigation 4
  if (name === 'Main' || name === 'WalletTabHome' || name === 'Home') name = 'WalletView'

  return name
}

export const capitalize = str => (str && str.charAt(0).toUpperCase() + str.slice(1)) || false

export const toUpperCase = (str?: string) => typeof str === 'string' ? str.toUpperCase() : ''

export const toLowerCase = (str?: string) => typeof str === 'string' ? str.toLowerCase() : ''

export const isEmpty = (str?: string)  => typeof str === 'string' ? str.trim() === '' : true;

export const toLowerCaseEquals = (a, b) => {
  if (!a && !b) return false
  return tlc(a) === tlc(b)
}

export const shallowEqual = (object1, object2) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }

  return true
}
export const changeCaseObj = (obj) => {
  const newObj = {}
  Object.entries(obj).forEach(i => {
    newObj[camelCase(i[0])] = i[1]
  })
  return newObj
}

export function throttle(callback, limit) {
  let waiting = false;                      // Initially, we're not waiting
  return () => {                      // We return a throttled function
    if (!waiting) {                       // If we're not waiting
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line prefer-rest-params
      callback.apply(this, arguments);  // Execute users function
      waiting = true;                   // Prevent future invocations
      setTimeout(function () {          // After a period of time
        waiting = false;              // And allow future invocations
      }, limit);
    }
  }
}

export function debounce(f, ms) {
  let isCooldown = false;

  return () => {
    if (isCooldown) return;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    f.apply(this, arguments);

    isCooldown = true;

    setTimeout(() => isCooldown = false, ms);
  };

}

export const memoize = (func) => {
  // a cache of results
  const results = {};
  // return a function for the cache of results
  return (...args) => {
    // a JSON key to save the results cache
    const argsKey = JSON.stringify(args);
    // execute `func` only if there is no cached value of clumsysquare()
    if (!results[argsKey]) {
      // store the return value of clumsysquare()
      results[argsKey] = func(...args);
    }
    // return the cached results
    return results[argsKey];
  };
};

export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}