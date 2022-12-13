type Vector3Object = {
  x: number;
  y: number;
  z: number;
};

export function vecArrayToObject(vec: any): Vector3Object {
  return {
    x: vec[0],
    y: vec[1],
    z: vec[2],
  };
}
