import "express-session";

declare module "express-session" {
  interface SessionData {
    client_id?: string;
    messages?: string[];
  }
}
