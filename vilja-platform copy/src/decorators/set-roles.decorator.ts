import { SetMetadata } from "@nestjs/common";

export const SetRoles = (...args: string[]) => SetMetadata("roles", args);
