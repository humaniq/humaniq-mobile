import { Platform } from "react-native"

export const noop = (..._: any[]) => {}

export const toLowerCase = (text: string) => text.toLowerCase()

export const isEmpty = (str?: string | null | undefined) =>
  typeof str === "string" ? str.trim() === "" : true

export const IS_ANDROID = Platform.OS === "android"
export const IS_IOS = !IS_ANDROID

export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}
