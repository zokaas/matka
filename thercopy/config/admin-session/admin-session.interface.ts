export interface IBasicAuthConfig {
  username: string;
  password: string;
}

export interface IAdminSessionConfig {
  master: IBasicAuthConfig;
  fi: IBasicAuthConfig;
  nl: IBasicAuthConfig;
  se: IBasicAuthConfig;
}
