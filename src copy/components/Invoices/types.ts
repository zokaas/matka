import { T_FormattedInvoice } from "@opr-finance/feature-statements";
import { SystemStyleObject } from "@styled-system/css";

export type T_InvoicesTableProps = {
    data: Array<T_FormattedInvoice>;
    onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, documentId: string) => void;
};

export type T_ColumnsProps = {
    onClick: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, documentId: string) => void;
    styleConfig: {
        invoicesTableLink: SystemStyleObject;
    };
};
