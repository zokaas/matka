import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { ContactPageStyles } from "@opr-finance/theme-flex-online";
import { StyledPageTitle } from "@opr-finance/component-content";
import { StyledGrid } from "@opr-finance/component-grid";
import { Font } from "@opr-finance/component-fonts";
import { Link } from "@opr-finance/component-link-to";

import { ContactPageProps } from "./types";
import { AppState, E_Routes } from "../../types/general";
import { messages } from "./messages";
import { onComponentMounted } from "../../utils";

export function ContactPage(props: ContactPageProps) {
    const { formatMessage: fm } = useIntl();
    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    useEffect(() => {
        onComponentMounted(boardMemberId);
    }, []);

    return (
        <StyledGrid styleConfig={{ root: ContactPageStyles.contactPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: ContactPageStyles.contactPageInfoContainer() }}>
                <StyledGrid styleConfig={{ root: ContactPageStyles.contactPageInfoBox() }}>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boxTitle }} as="p">
                        {fm(messages.headingContact)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.subheadingLeft1)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.textOpen)}
                        <Font styleConfig={{ root: props.styleConfig.textStyle.contentText }}>
                            {fm(messages.textOpeningHours)}
                        </Font>
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.textPhone)}
                        <Font styleConfig={{ root: props.styleConfig.textStyle.contentText }}>
                            {fm(messages.textPhoneNumber)}
                        </Font>
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.emailText)}
                        <Font styleConfig={{ root: props.styleConfig.textStyle.contentText }}>
                            <Link
                                href={fm(messages.emailLink)}
                                styleConfig={{ root: ContactPageStyles.contactPageLinkEmail() }}>
                                {fm(messages.emailLinkText)}
                            </Link>
                        </Font>
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.subheadingLeft2)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.contentText }}>
                        <Link
                            href={`${process.env.REACT_APP_FAQ_URL}`}
                            target="_blank"
                            styleConfig={{ root: ContactPageStyles.contactPageLinkFaq() }}>
                            {fm(messages.FAQLinkText)}
                        </Link>
                    </Font>
                </StyledGrid>
                <StyledGrid styleConfig={{ root: ContactPageStyles.contactPageInfoBox() }}>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boxTitle }} as="p">
                        {fm(messages.headingGeneral)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.subheadingRight1)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.contentText }} as="p">
                        {fm(messages.textContent1)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.subheadingRight2)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.contentText }} as="p">
                        {fm(messages.textContent2)}

                        <Link
                            href={`${process.env.REACT_APP_NEW_APPLICATION}`}
                            target="_blank"
                            styleConfig={{ root: ContactPageStyles.contactPageLink() }}>
                            {fm(messages.textContent2LinkText)}
                        </Link>
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.boldedText }} as="p">
                        {fm(messages.subheadingRight3)}
                    </Font>
                    <Font styleConfig={{ root: props.styleConfig.textStyle.contentText }} as="p">
                        {fm(messages.textContent3)}
                    </Font>
                    <Font styleConfig={{ root: ContactPageStyles.contactPageTextWrapper() }} as="p">
                        {fm(messages.sveaPhone)}
                    </Font>
                    <Font styleConfig={{ root: ContactPageStyles.contactPageTextWrapper() }} as="p">
                        {fm(messages.emailText)}
                        <Link
                            href={fm(messages.sveaEmailLink)}
                            styleConfig={{ root: ContactPageStyles.contactPageLinkEmail() }}>
                            {fm(messages.sveaEmailText)}
                        </Link>
                    </Font>
                </StyledGrid>
            </StyledGrid>
        </StyledGrid>
    );
}
