import { Platform } from 'react-native';

export const THEME = {
  white: '#FFFDFB',
  peach: '#FFDCC2',
  peachDeep: '#FFB98F',
  pink: '#FFCBD8',
  pinkDeep: '#F195AC',
  roseGold: '#C98C6B',
  ink: '#4A2C33',
  inkSoft: '#B08C93',
  line: '#F1DECF',
  cardBg: '#FFF9F4',
  fonts: {
    displayBold: Platform.select({
      web: "'Playfair Display', Georgia, serif",
      default: 'PlayfairDisplay_700Bold',
    }),
    displayItalic: Platform.select({
      web: "'Playfair Display', Georgia, serif",
      default: 'PlayfairDisplay_500Medium_Italic',
    }),
    bodyRegular: Platform.select({
      web: "'Quicksand', -apple-system, sans-serif",
      default: 'Quicksand_500Medium',
    }),
    bodySemiBold: Platform.select({
      web: "'Quicksand', -apple-system, sans-serif",
      default: 'Quicksand_600SemiBold',
    }),
    bodyBold: Platform.select({
      web: "'Quicksand', -apple-system, sans-serif",
      default: 'Quicksand_700Bold',
    }),
  },
};
