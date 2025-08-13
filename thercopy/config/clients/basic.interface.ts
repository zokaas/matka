export interface IBasicClientConfig {
  realm: "fi" | "se" | "nl" | "master";
  clientId: string;
  clientSecret: string;
  encodedClientCredentials: string; //check this for Finland and Sweden
  callbackUrl: {
    host: string;
    loginPath: string;
    logoutPath: string;
    loginQueryParam: string;
    errorPath: string;
  };
  providerType: "bankid" | "ftn";
  idp: "signicat" | "telia" | "admin-tools";
  redirectUrl: string;
}
