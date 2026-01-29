/**
 * RGB 채널 값이 유효 범위(0 ~ 255)를 벗어나지 않도록 클램프(clamp)합니다.
 *
 * @param channelValue 입력 채널 값
 * @returns 0~255 범위로 제한된 값
 */
const clampToRgbChannelRange = (channelValue: number): number => {
  return Math.max(0, Math.min(255, channelValue));
};

/**
 * HEX 색상 문자열을 RGB 채널 배열로 파싱합니다.
 *
 * 지원 포맷:
 * - `#RGB` (3자리)  → 각 자리 확장하여 `#RRGGBB`로 처리
 * - `#RRGGBB` (6자리)
 * - `#RRGGBBAA` (8자리) → alpha는 무시하고 앞 6자리만 사용
 *
 * @param hexColor HEX 색상 문자열(예: `#2E90FA`, `#fff`, `#2E90FA80`)
 * @returns `[r, g, b]` (각 0~255) 또는 파싱 실패 시 `null`
 */
const parseHexColorToRgb = (hexColor: string): [number, number, number] | null => {
  const normalizedHex = hexColor.trim().replace('#', '');
  if (![3, 6, 8].includes(normalizedHex.length)) return null;

  const hexWithoutAlpha =
    normalizedHex.length === 3
      ? normalizedHex
          .split('')
          .map((digit) => digit + digit)
          .join('')
      : normalizedHex.length === 8
        ? normalizedHex.slice(0, 6) // alpha는 버림
        : normalizedHex;

  const red = parseInt(hexWithoutAlpha.slice(0, 2), 16);
  const green = parseInt(hexWithoutAlpha.slice(2, 4), 16);
  const blue = parseInt(hexWithoutAlpha.slice(4, 6), 16);

  if ([red, green, blue].some((channel) => Number.isNaN(channel))) return null;

  return [red, green, blue];
};

/**
 * CSS `rgb()` / `rgba()` 함수 문자열을 RGB 채널 배열로 파싱합니다.
 *
 * 입력:
 * - `rgb(1 2 3)` (공백 구분)
 * - `rgb(1, 2, 3)` (콤마 구분)
 * - `rgba(1 2 3 / 0.5)` (알파 포함) → 알파는 무시
 * - `rgba(1, 2, 3, 0.5)` (알파 포함) → 알파는 무시
 *
 * @param cssRgbFunction CSS rgb/rgba 함수 문자열
 * @returns `[r, g, b]` (각 0~255) 또는 파싱 실패 시 `null`
 */
const parseCssRgbFunctionToRgb = (cssRgbFunction: string): [number, number, number] | null => {
  // rgb(1 2 3) / rgb(1,2,3) / rgba(...)
  const match = cssRgbFunction.trim().match(/^rgba?\((.+)\)$/i);
  if (!match) return null;

  const functionArguments = match[1].trim();

  const argumentParts = functionArguments
    .split(/[,\s/]+/)
    .map((part) => part.trim())
    .filter(Boolean);

  if (argumentParts.length < 3) return null;

  const red = Number(argumentParts[0]);
  const green = Number(argumentParts[1]);
  const blue = Number(argumentParts[2]);

  if ([red, green, blue].some((channel) => Number.isNaN(channel))) return null;

  return [clampToRgbChannelRange(red), clampToRgbChannelRange(green), clampToRgbChannelRange(blue)];
};

/**
 * 색상 값(문자열)을 **"R G B" 채널 문자열**로 변환합니다.
 *
 * 주 용도:
 * - Tailwind의 alpha/opacity 유틸리티 등에서 `--color-rgb: 46 144 250;` 처럼
 *   채널 값을 분리해 쓰기 위한 전처리.
 *
 * 입력:
 * - HEX: `#RGB`, `#RRGGBB`, `#RRGGBBAA` (alpha는 무시)
 * - CSS 함수: `rgb(...)`, `rgba(...)` (alpha는 무시)
 *
 * @param value 색상 값(일반적으로 토큰의 value)
 * @returns `"R G B"` 형태의 문자열(예: `"46 144 250"`) 또는 `null`
 */
export const colorToRgbChannels = (value: unknown): string | null => {
  if (typeof value !== 'string') return null;

  const trimmedValue = value.trim();

  if (trimmedValue.startsWith('#')) {
    const rgb = parseHexColorToRgb(trimmedValue);
    return rgb ? `${rgb[0]} ${rgb[1]} ${rgb[2]}` : null;
  }

  if (/^rgba?\(/i.test(trimmedValue)) {
    const rgb = parseCssRgbFunctionToRgb(trimmedValue);
    return rgb ? `${rgb[0]} ${rgb[1]} ${rgb[2]}` : null;
  }

  return null;
};
