import { SystemStyleObject } from "@styled-system/css";

export type BankButtonProps = {
    onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
    key?: string;
    styleConfig: {
        buttonContainer: SystemStyleObject;
        bankContainer: SystemStyleObject;
    };
};
