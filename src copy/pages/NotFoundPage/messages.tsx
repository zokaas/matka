import React from "react";
import { defineMessages } from "react-intl";
import { LinkTo } from "@opr-finance/component-link-to";

export const messages = defineMessages({
    pageTitle: {
        id: "page.notfound.title",
    },
    errorMessage: {
        id: "page.notfound.message",
        values: {
            link: (value) => {
                const attrs = value[0].split("|");
                return (
                    <LinkTo variant="basic" href={attrs[1]} fontSize="20px" fontWeight="bold">
                        {attrs[0]}
                    </LinkTo>
                );
            },
        },
    },
});
