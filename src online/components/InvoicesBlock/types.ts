import { T_FormattedInvoice } from "@opr-finance/feature-statements";

export type T_InvoicesProps = {
    data: Array<T_FormattedInvoice>;
    getPdfClick: (
        event: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
        documentId: string
    ) => void;
};
