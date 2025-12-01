export class LogBodyDto {
  level: "error" | "debug";
  message: string;
  [key: string]: unknown;
}
