import React, { useState } from "react";

import { Font } from "@opr-finance/component-fonts";
import { StyledGrid } from "@opr-finance/component-grid";
import { Link } from "@opr-finance/component-link-to";
import { FrontPageStyles } from "@opr-finance/theme-flex-online";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { T_CollectionBlockProps } from "./types";
import { DocumentModal } from "../DocumentModal";
import { messages } from "../../pages/LoanPage/messages";
import { useIntl } from "react-intl";
import { ReportingBlock } from "../ReportingBlock/ReportingBlock";
import { getDownloadButtonContent } from "@opr-finance/utils";

export function CollectionBlock(props: T_CollectionBlockProps) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const { formatMessage: fm } = useIntl();
    const [modalOpen, toggleModalOpen] = useState(false);
    const showReportingBlock = process.env.REACT_APP_REPORTING === "1" ? true : false;
    const {
        collectionStateHeading,
        collectionStateText,
        collectionStatePhoneText,
        collectionStatePhoneNumber,
        collectionStateEmailText,
        collectionStateEmailLinkText,
        collectionStateEmailLinkLink,
        documentInUse,
        defaultPromissoryNoteId,
        handleClick,
    } = props;
    logger.log("test info--", defaultPromissoryNoteId);

    return (
        <StyledGrid styleConfig={{ root: FrontPageStyles.frontPageRootStyles() }}>
            <StyledGrid styleConfig={{ root: FrontPageStyles.accountCollectionInfoBox() }}>
                <Font styleConfig={{ root: FrontPageStyles.accountCollectionInfoHeading() }}>
                    {collectionStateHeading}
                </Font>
                <Font styleConfig={{ root: FrontPageStyles.accountCollectionInfoText() }}>
                    {collectionStateText}
                </Font>
                <StyledGrid styleConfig={{ root: FrontPageStyles.collectionInfoItemContainer() }}>
                    <Font styleConfig={{ root: FrontPageStyles.accountCollectionInfoText() }}>
                        {collectionStatePhoneText}
                    </Font>
                    <Font styleConfig={{ root: FrontPageStyles.accountCollectionInfoText() }}>
                        {` ${collectionStatePhoneNumber}`}
                    </Font>
                </StyledGrid>
                <StyledGrid styleConfig={{ root: FrontPageStyles.collectionInfoItemContainer() }}>
                    <Font styleConfig={{ root: FrontPageStyles.accountCollectionInfoText() }}>
                        {`${collectionStateEmailText} `}
                    </Font>
                    <Link
                        styleConfig={{ root: FrontPageStyles.accountCollectionEmailLink() }}
                        href={collectionStateEmailLinkLink}>
                        {collectionStateEmailLinkText}
                    </Link>
                </StyledGrid>
            </StyledGrid>
            {showReportingBlock && <ReportingBlock />}
            <StyledGrid styleConfig={{ root: FrontPageStyles.creditAgreementContainer() }}>
                <Font styleConfig={{ root: FrontPageStyles.creditAgreementText() }}>
                    {fm(messages.pageTitle)}
                </Font>
                <StyledGrid styleConfig={{ root: FrontPageStyles.downloadButtonContainer() }}>
                    {getDownloadButtonContent(
                        documentInUse,
                        defaultPromissoryNoteId,
                        toggleModalOpen,
                        modalOpen,
                        fm(messages.loanDocumentsButtonText),
                        fm(messages.documentsError)
                    )}
                </StyledGrid>

                <DocumentModal
                    toggleModalOpen={toggleModalOpen}
                    modalOpen={modalOpen}
                    handleClick={handleClick}
                />
            </StyledGrid>
        </StyledGrid>
    );
}
