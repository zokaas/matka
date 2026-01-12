import React from "react";
import { useIntl } from "react-intl";

import { Font } from "@opr-finance/component-fonts";
import { StyledGrid } from "@opr-finance/component-grid";
import { FrontPageStyles } from "@opr-finance/theme-flex-online";
import { Image } from "@opr-finance/component-image";

import currencyImage from "../../images/OPR-Foretagslan-Flex-ut.svg";
import { useHistory } from "react-router-dom";
import { E_Routes } from "../../types/general";
import { messages } from "../../pages/LoanPage/messages";

export function WithdrawButtonMobile() {
    const history = useHistory();
    const { formatMessage: fm } = useIntl();

    return (
        <StyledGrid
            onClick={() => history.push(E_Routes.FRONT)}
            styleConfig={{
                root: FrontPageStyles.nostoContainer(),
            }}>
            <Image
                imageAlt="currency sign"
                imageSrc={currencyImage}
                styleConfig={{
                    root: FrontPageStyles.nostoImage(),
                }}></Image>{" "}
            <Font
                styleConfig={{
                    root: FrontPageStyles.nostoText(),
                }}>
                {fm(messages.withdrawButtonText)}
            </Font>
        </StyledGrid>
    );
}
