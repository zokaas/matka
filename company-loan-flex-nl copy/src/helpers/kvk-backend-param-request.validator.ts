import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { IS_KVK_NAME, IS_KVK_NUMBER } from "../constants";

@ValidatorConstraint({ name: "checkKvkBackendParams", async: false })
export class CustomKvkRequestParamValidator
  implements ValidatorConstraintInterface
{
  validate(
    value: never,
    args: ValidationArguments
  ): Promise<boolean> | boolean {
    const object = args.object;

    return (
      (IS_KVK_NAME in object || IS_KVK_NUMBER in object) &&
      !(IS_KVK_NAME in object && IS_KVK_NUMBER in object)
    );
  }
  defaultMessage?(args?: ValidationArguments): string {
    return "Either naam or kvkNummer must be defined.";
  }
}
