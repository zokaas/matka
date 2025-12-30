import React, { useState } from "react";
import { format } from "date-fns";
import { useIntl } from "react-intl";

import { StyledGrid } from "@opr-finance/component-grid";
import {
    ButtonStyles,
    FontsStyles,
    LoanPageStyles,
    ModalStyles,
} from "@opr-finance/theme-flex-online";
import { StyledButton } from "@opr-finance/component-button";
import { Icon } from "@opr-finance/component-icon";
import { Link } from "@opr-finance/component-link-to";
import { Modal } from "@opr-finance/component-modal-dialog";
import { Font } from "@opr-finance/component-fonts";

import { DocumentModal } from "../DocumentModal";
import { T_InfoAndContactProps } from "./types";
import { messages } from "../../pages/LoanPage/messages";
import { DateFormat } from "@opr-finance/component-date";

export function InfoAndContactBlock(props: T_InfoAndContactProps) {
    const { formatMessage: fm } = useIntl();

    const [modalOpen, toggleModalOpen] = useState(false);

    return (
        <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageInfoContainer() }}>
            <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageInfoBox() }}>
                <Font styleConfig={{ root: FontsStyles.fontBoxTitle() }} as="p">
                    {fm(messages.pageTitle)}
                </Font>
                <Font styleConfig={{ root: FontsStyles.fontContentText() }} as="p">
                    {`${fm(messages.textContentLeft1)}${format(new Date(), DateFormat.Sweden)}`}
                </Font>
                <Font styleConfig={{ root: FontsStyles.fontAmountHeading() }} as="p">
                    {props.availableBalanceCurrency}
                </Font>
                <Font styleConfig={{ root: FontsStyles.fontContentText() }} as="p">
                    {fm(messages.textContentLeft2)}
                </Font>
                {props.documentInUse ? (
                    props.defaultPromissoryNoteId ? (
                        <StyledButton
                            onClick={() => toggleModalOpen(!modalOpen)}
                            styleConfig={{ root: ButtonStyles.greenButtonStyles() }}>
                            <Font styleConfig={{ root: ButtonStyles.buttonFontStyles() }}>
                                {fm(messages.loanDocumentsButtonText)}
                                <Icon icon={["fa", "angle-double-right"]} />{" "}
                            </Font>
                        </StyledButton>
                    ) : (
                        <Font styleConfig={{ root: FontsStyles.fontContentText(true) }} as="p">
                            {fm(messages.documentsError)}
                        </Font>
                    )
                ) : (
                    <p></p>
                )}
                <DocumentModal
                    toggleModalOpen={toggleModalOpen}
                    modalOpen={modalOpen}
                    handleClick={props.handleClick}
                />
            </StyledGrid>
            <StyledGrid styleConfig={{ root: LoanPageStyles.loanPageInfoBox() }}>
                <Font styleConfig={{ root: FontsStyles.fontBoxTitle() }} as="p">
                    {fm(messages.heading1)}
                </Font>
                <Font styleConfig={{ root: FontsStyles.fontContentText() }} as="p">
                    {fm(messages.textContentRight1)}
                </Font>
                <StyledGrid
                    styleConfig={{ root: LoanPageStyles.loanPageInfoBoxContactContainer() }}>
                    <Font styleConfig={{ root: FontsStyles.fontBoldedTextSpan() }} as="p">
                        {fm(messages.textPhone)}
                    </Font>
                    <Font styleConfig={{ root: FontsStyles.fontContentText() }}>
                        {fm(messages.textPhoneNumber)}
                    </Font>
                </StyledGrid>

                <Font styleConfig={{ root: FontsStyles.fontBoldedText() }} as="p">
                    {fm(messages.textEmail)}
                </Font>
                <Font styleConfig={{ root: FontsStyles.fontContentText() }}>
                    <Link
                        href={fm(messages.textEmailLink)}
                        styleConfig={{ root: LoanPageStyles.loanPageLinkEmail() }}>
                        {fm(messages.textEmailText)}{" "}
                    </Link>
                </Font>
                <Font styleConfig={{ root: FontsStyles.fontBoldedText() }} as="p">
                    {fm(messages.textContentRight2)}
                </Font>
            </StyledGrid>
        </StyledGrid>
    );
}
