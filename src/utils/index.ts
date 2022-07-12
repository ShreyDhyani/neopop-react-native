import { Platform, TextStyle, TransformsStyle } from 'react-native';
import { FontType, FontWeight } from '../components/Typography/types';

export const hexToRGBA = (hex: string, alpha: string | number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);

    return alpha ? `rgba(${r}, ${g}, ${b}, ${alpha})` : `rgb(${r}, ${g}, ${b})`;
};

export const isEmpty = (value: any) =>
    value == null ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (value?.constructor?.name === 'Object' && Object.keys(value).length === 0) ||
    ((value?.constructor?.name === 'Map' || value?.constructor?.name === 'Set') &&
        value.size === 0);

export const getTransform = (
    transforms: (NonNullable<TransformsStyle['transform']>[0] | { translateZ: number })[],
) =>
    transforms.filter(
        (transform) => !('translateZ' in transform) || Platform.OS === 'web',
    ) as TransformsStyle['transform'];

export const generateTextStyle = (
    fontType = FontType.BODY,
    fontSize = 14,
    fontWeight = FontWeight.REGULAR,
    color = '#FFFFFF',
): TextStyle => {
    const LINE_HEIGHT_MULTIPLIER = {
        [FontType.HEADING]: 1.25,
        [FontType.CAPS]: 1.25,
        [FontType.BODY]: 1.5,
        [FontType.SERIF_HEADING]: 1.25,
    };

    const getLetterSpacing = (fType: FontType, fSize: number, fWeight: FontWeight) => {
        switch (fType) {
            case FontType.HEADING:
                switch (fWeight) {
                    case FontWeight.EXTRA_BOLD:
                        return fSize >= 44 ? 0 : 0.2;
                    case FontWeight.BOLD:
                        return fSize >= 13 ? 0.2 : 0.4;
                    case FontWeight.SEMI_BOLD:
                        return fSize >= 18 ? 0.2 : 0.4;
                    default:
                        return 0.2;
                }
            case FontType.CAPS:
                return fSize > 8 ? 2 : 1;
            case FontType.BODY:
                return 0.4;
            case FontType.SERIF_HEADING:
                return 0.2;
            default:
                return 0.4;
        }
    };

    const letterSpacing = getLetterSpacing(fontType, fontSize, fontWeight);

    return {
        color,
        fontSize,
        fontStyle: 'normal',
        fontWeight,
        letterSpacing,
        lineHeight: Math.round(fontSize * LINE_HEIGHT_MULTIPLIER[fontType]),
        ...(fontType === FontType.CAPS && {
            textTransform: 'uppercase',
        }),
    };
};

export const isObject = (item: any) => item instanceof Object && !Array.isArray(item);

export const mergeDeep = (target: any, ...sources: any[]): any => {
    if (sources.length === 0) {
        return target;
    }
    const source = sources.shift();

    if (isObject(target) && isObject(source)) {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) {
                    Object.assign(target, { [key]: {} });
                }
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }

    return mergeDeep(target, ...sources);
};
