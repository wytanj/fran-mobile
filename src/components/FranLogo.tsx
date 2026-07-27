import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';
import { colors } from '../theme';

type Variant = 'default' | 'yellow' | 'white' | 'brown';

const sources = {
  default: require('../../assets/logo-2c.png'),
  yellow: require('../../assets/logo-2c.png'),
  white: require('../../assets/logo-2c-white.png'),
};

/**
 * Fran wordmark — brandworld logo Option 2C.
 * `default` / `yellow`: yellow mark — needs a dark or white ground; it
 *   disappears on cream and on yellow.
 * `white`: light mark (use on yellow or brown).
 * `brown`: light mark tinted brown — the legible choice on cream and yellow.
 */
export function FranLogo({
  height = 36,
  variant = 'default',
  style,
}: {
  height?: number;
  variant?: Variant;
  style?: StyleProp<ImageStyle>;
}) {
  // Source art is ~212×111
  const width = Math.round(height * (212 / 111));
  const isBrown = variant === 'brown';

  return (
    <Image
      source={isBrown ? sources.white : sources[variant]}
      tintColor={isBrown ? colors.brown : undefined}
      style={[{ width, height, resizeMode: 'contain' }, style]}
      accessibilityLabel="fran"
    />
  );
}
