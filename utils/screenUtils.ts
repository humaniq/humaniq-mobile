import { Dimensions } from "react-native"

const DESIGN_WIDTH = 360;
const DESIGN_HEIGHT = 640;

export const SCREEN_HEIGHT = Dimensions.get("window").height

export const SCREEN_WIDTH = Dimensions.get("window").width

export const viewPortCalc = (px: number, design: number, screen: number) => {
    return Math.ceil((px * screen) / design);
};

export const vw = (px: number) => {
    return viewPortCalc(px, DESIGN_WIDTH, SCREEN_WIDTH);
};

export const vh = (px: number) => {
    return viewPortCalc(px, DESIGN_HEIGHT, SCREEN_HEIGHT);
};

export const  fontScale = (sWidth, dWidth) => {
    return sWidth / dWidth;
}

export const toDp = (px) => {
    return px * SCREEN_WIDTH / DESIGN_WIDTH;
}
