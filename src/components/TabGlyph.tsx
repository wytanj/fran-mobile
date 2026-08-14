import React from 'react';
import { View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { colors } from '../theme';

/** Figma footer glyphs (`45:1246`) — exported assets, painted with Fran brown/yellow. */
const XML: Record<'discover' | 'you' | 'scan' | 'rewards' | 'account', string> = {
  discover: `<svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.75 6.5H15.1667M9.75 6.5V9.20833H15.1667V6.5M9.75 6.5V4.875C9.75 3.25 11.375 2.16667 13 2.16667H18.9583C18.9583 2.16667 15.1667 3.25 15.1667 5.41667V6.5M7.04167 10.2917C7.04167 10.0043 7.1558 9.7288 7.35897 9.52563C7.56213 9.32247 7.83768 9.20833 8.125 9.20833H16.7917C17.079 9.20833 17.3545 9.32247 17.5577 9.52563C17.7609 9.7288 17.875 10.0043 17.875 10.2917V20.5833C17.875 20.5833 17.875 23.8333 14.625 23.8333H10.2917C7.04167 23.8333 7.04167 20.5833 7.04167 20.5833V10.2917Z" stroke="#533827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  you: `<svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 1.00002C8.167 2.11802 10.333 6.63302 8 9.94102C9.41 11.059 10.583 11.059 12.667 7.70603C13.768 8.89102 15 11.582 15 13.294C15 16.998 11.866 20 8 20C4.134 20 1 16.998 1 13.294C1 11 1.903 9.11402 3.333 7.70603C4.765 6.29902 7 4.39502 7 1.00002Z" stroke="#533827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  scan: `<svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.5 10.5H6.5C7.05386 10.5 7.5 10.9461 7.5 11.5V16.5C7.5 17.0539 7.05386 17.5 6.5 17.5H1.5C0.946142 17.5 0.5 17.0539 0.5 16.5V11.5C0.5 10.9461 0.946142 10.5 1.5 10.5ZM17.5 16.5V17.5H16.5V16.5H17.5ZM13.5 16.5V17.5H12.5V16.5H13.5ZM1.5 16.5H6.5V11.5H1.5V16.5ZM15.5 14.5V15.5H14.5V14.5H15.5ZM11.5 14.5V15.5H10.5V14.5H11.5ZM17.5 12.5V13.5H16.5V12.5H17.5ZM13.5 12.5V13.5H12.5V12.5H13.5ZM15.5 10.5V11.5H14.5V10.5H15.5ZM11.5 10.5V11.5H10.5V10.5H11.5ZM1.5 0.5H6.5C7.05386 0.5 7.5 0.946142 7.5 1.5V6.5C7.5 7.05386 7.05386 7.5 6.5 7.5H1.5C0.946142 7.5 0.5 7.05386 0.5 6.5V1.5C0.5 0.946142 0.946142 0.5 1.5 0.5ZM11.5 0.5H16.5C17.0539 0.5 17.5 0.946142 17.5 1.5V6.5C17.5 7.05386 17.0539 7.5 16.5 7.5H11.5C10.9461 7.5 10.5 7.05386 10.5 6.5V1.5C10.5 0.946142 10.9461 0.5 11.5 0.5ZM1.5 6.5H6.5V1.5H1.5V6.5ZM11.5 6.5H16.5V1.5H11.5V6.5Z" fill="#533827" stroke="#533827"/></svg>`,
  rewards: `<svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 1L14 7L19 3L17 13H3L1 3L6 7L10 1Z" fill="#FEDE02" stroke="#533827" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  account: `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 0C10.2091 0 12 1.79086 12 4C12 6.20914 10.2091 8 8 8C5.79086 8 4 6.20914 4 4C4 1.79086 5.79086 0 8 0ZM8 9C12.4183 9 16 10.7909 16 13V16H0V13C0 10.7909 3.58172 9 8 9Z" fill="#533827"/></svg>`,
};

export type TabGlyphName = keyof typeof XML;

export function TabGlyph({
  name,
  size = 24,
  color = colors.brown,
}: {
  name: TabGlyphName;
  size?: number;
  color?: string;
}) {
  const xml = XML[name]
    .replace(/#533827/g, color)
    .replace(/#FEDE02/g, colors.yellow);

  return (
    <View style={{ width: size, height: size, overflow: 'hidden' }}>
      <SvgXml xml={xml} width={size} height={size} />
    </View>
  );
}
