import Toast from 'react-native-simple-toast';

const ToastConstants = {
    SHORT: Toast.SHORT,
    LONG: Toast.LONG,
    TOP: Toast.TOP,
    BOTTOM: Toast.BOTTOM,
    CENTER: Toast.CENTER,
}

/**
 * Wrapper of native toast component
 */
export default {
    show(message: string, duration: number = ToastConstants.SHORT) {
        Toast.show(message, duration)
    },
    showWithGravity(message: string, duration: number = ToastConstants.SHORT, gravity: string = ToastConstants.BOTTOM) {
        Toast.showWithGravity(message, duration, gravity)
    }
}