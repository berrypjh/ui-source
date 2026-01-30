export interface TypographyStyle {
  fontFamily: string;
  fontWeight: number;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
}

export interface TypographyTokens {
  fontFamily: {
    base: string;
  };

  fontSize: {
    xxsm: number;
    xsm: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
    '7xl': number;
  };

  lineHeight: {
    xxxsm: number;
    xxsm: number;
    xsm: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    '3xl': number;
    '4xl': number;
    '5xl': number;
    '6xl': number;
    '7xl': number;
  };

  letterSpacing: {
    xxsm: number;
    xsm: number;
    sm: number;
    md: number;
  };

  fontWeight: {
    light: number;
    regular: number;
    semiBold: number;
    bold: number;
    extraBold: number;
  };

  display: {
    huge: TypographyStyle;
    large: TypographyStyle;
    medium: TypographyStyle;
  };

  heading: {
    h1: TypographyStyle;
    h2: TypographyStyle;
    h3: TypographyStyle;
    h4: TypographyStyle;
    h5: TypographyStyle;
    h6: TypographyStyle;
  };

  body: {
    largeStrong: TypographyStyle;
    large: TypographyStyle;
    mediumStrong: TypographyStyle;
    medium: TypographyStyle;
    smallStrong: TypographyStyle;
    small: TypographyStyle;
    tinyStrong: TypographyStyle;
    tiny: TypographyStyle;
  };

  paragraph: {
    large: TypographyStyle;
    default: TypographyStyle;
    small: TypographyStyle;
    tiny: TypographyStyle;
  };

  caption: {
    default: TypographyStyle;
    small: TypographyStyle;
    tiny: TypographyStyle;
  };
}
