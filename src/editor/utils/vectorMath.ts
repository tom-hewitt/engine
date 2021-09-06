export const multiply = (a: vector3d, b: number) => {
  a.x *= b;
  a.y *= b;
  a.z *= b;
  return a;
};

export const divide = (a: vector3d, b: number) => {
  a.x = a.x === 0 ? 0 : a.x / b;
  a.y = a.y === 0 ? 0 : a.y / b;
  a.z = a.z === 0 ? 0 : a.z / b;
  return a;
};

export const modulus = (a: vector3d) => {
  return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
};

export const normalise = (a: vector3d) => {
  return divide(a, modulus(a));
};
