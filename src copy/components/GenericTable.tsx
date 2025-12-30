import React from "react";
import { Table, TData, TColumns } from "@opr-finance/component-table";
import { Icon } from "@opr-finance/component-icon";
import { flexTheme } from "@opr-finance/themes";

export type GenericTableProps<T> = {
    data: TData<T>;
    columns: TColumns<T>;
};

export function GenericTable<T>(props: GenericTableProps<T>) {
    return (
        <Table
            leftIcon={<Icon icon={["fas", "caret-left"]} />}
            rightIcon={<Icon icon={["fas", "caret-right"]} />}
            pagesIcon={<Icon icon={["fas", "caret-down"]} />}
            translation={{ labelPrefix: "Näytä", noDataText: "Ei dataa" }}
            itemsPerPage={6}
            theme={flexTheme}
            columns={props.columns}
            data={props.data}
        />
    );
}
