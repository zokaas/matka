import { Equals, IsInt } from "class-validator";

export class CreateTrancheDto {
  @IsInt()
  appliedAmount: number;

  @Equals("CASH_WITHDRAWAL")
  type: string;

  @Equals("MY_PAGES")
  channel: string;
}
