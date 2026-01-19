import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

export const wp = (value: number) => width * (value / 100);
export const hp = (value: number) => height * (value / 100);
export const fs = (size: number) => size * PixelRatio.getFontScale();
