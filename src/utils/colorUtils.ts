export function rgbToInt({ r, g, b }: rgb) {
  // 16^4 = 65536
  // 16^2 = 256
  return r * 65536 + g * 256 + b;
}
