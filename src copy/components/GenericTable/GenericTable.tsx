import React from "react";
import { useIntl } from "react-intl";
import { StyledTable, TData, TColumns } from "@opr-finance/component-table";
import { Icon } from "@opr-finance/component-icon";
import { TableStyles, ButtonStyles } from "@opr-finance/theme-flex-online";

import { messages } from "./messages";

export type GenericTableProps<T> = {
    data: TData<T>;
    columns: TColumns<T>;
    noTableHead?: boolean;
    showAll?: boolean;
};

export function GenericTable<T>(props: GenericTableProps<T>) {
    const { formatMessage: fm } = useIntl();

    return (
        <StyledTable
            showAll={props.showAll ?? false}
            leftIcon={<Icon icon={["fa", "angle-double-left"]} />}
            rightIcon={<Icon icon={["fa", "angle-double-right"]} />}
            pagesIcon={<Icon icon={["fas", "caret-down"]} />}
            translation={{ labelPrefix: fm(messages.show), noDataText: fm(messages.noData) }}
            itemsPerPage={6}
            styleConfig={{
                table: TableStyles.tableLayout(),
                headCells: TableStyles.tableHeaders(),
                rows: TableStyles.tableRows(),
                cells: TableStyles.tableCell(),
                expanderButton: {},
                pagination: {
                    style: {},
                    pageButtonsStyle: {},
                },
            }}
            columns={props.columns}
            data={props.data}
            noTableHead={props.noTableHead}
        />
    );
}
