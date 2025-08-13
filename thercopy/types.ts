import { Request } from "express";

export type TRequestQueryParameters = {
  bank?: string;
  lang?: string;
  formId?: string;
};

export type TRequestParameters = {
  kcClientId: string;
};

export type TRequestWithSession = Request<
  TRequestParameters,
  unknown,
  unknown,
  TRequestQueryParameters
> & {
  session: {
    formId: string;
    client_id: string;
    queryparams: TRequestQueryParameters;
  };
  sessionId: string;
};

export type TRealmConfigKeys = "nl" | "se" | "fi" | "master";

export type TRealmConfigMapValues = {
  kc_idp_hint?: string;
  acr_values?: string;
};
