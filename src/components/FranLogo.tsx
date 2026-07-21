import React from 'react';
import { Image, type ImageStyle, type StyleProp } from 'react-native';

type Variant = 'default' | 'yellow' | 'white';

const sources = {
  default: require('../../assets/logo-2c.png'),
  yellow: require('../../assets/logo-2c.png'),
  white: require('../../assets/logo-2c-white.png'),
};

/**
 * Fran wordmark — brandworld logo Option 2C.
 * `default` / `yellow`: yellow mark (use on cream/white/dark).
 * `white`: light mark (use on yellow or brown).
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
  return (
    <Image
      source={sources[variant]}
      style={[{ width, height, resizeMode: 'contain' }, style]}
      accessibilityLabel="fran"
    />
  );
}
