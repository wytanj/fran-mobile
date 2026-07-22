import React, { forwardRef } from 'react';
import {
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  type TextInputProps,
  type TextProps,
} from 'react-native';
import { resolveFontFamily, useTypography } from '../context/TypographyContext';

export const Text = forwardRef<React.ElementRef<typeof NativeText>, TextProps>(
  function ThemedText({ style, ...props }, ref) {
    const { variant } = useTypography();
    const family = resolveFontFamily(variant, StyleSheet.flatten(style)?.fontFamily);
    return <NativeText ref={ref} style={[style, family ? { fontFamily: family } : null]} {...props} />;
  },
);

export const TextInput = forwardRef<React.ElementRef<typeof NativeTextInput>, TextInputProps>(
  function ThemedTextInput({ style, ...props }, ref) {
    const { variant } = useTypography();
    const family = resolveFontFamily(variant, StyleSheet.flatten(style)?.fontFamily);
    return (
      <NativeTextInput ref={ref} style={[style, family ? { fontFamily: family } : null]} {...props} />
    );
  },
);
