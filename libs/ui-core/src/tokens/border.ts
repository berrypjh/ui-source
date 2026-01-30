export interface BorderStyle {
  color: string;
  width: number;
}

export interface BorderWidthTokens {
  primitive: {
    hairline: number;
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    '3xl': number;
  };
  semantic: {
    divider: number;
    default: number;
    focus: number;
    strong: number;
    outline: number;
    hairline: number;
  };
}

export interface BorderTokens {
  primary: BorderStyle;
  disabled: BorderStyle;
}
