declare module "topojson-client" {
  export function feature(
    topology: any,
    object: {
      type: string;
      geometries?: any[];
    }
  ): GeoJSON.Feature;
}
