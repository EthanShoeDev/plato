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

export function vecObjectToArray(vec: Vector3Object): [number, number, number] {
  return [vec.x, vec.y, vec.z];
}

export function quartObjectToArray(
  quart: any,
): [number, number, number, number] {
  return [quart.x, quart.y, quart.z, quart.w];
}
