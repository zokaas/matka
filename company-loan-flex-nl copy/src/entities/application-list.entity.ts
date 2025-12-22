export class ApplicationListEntity {
  applications: Array<string>;
  realm: "fi" | "nl" | "se";
  kcClientId: string;
  listLocked: boolean;

  constructor(object: ApplicationListEntity) {
    Object.assign(this, object);
  }
}
