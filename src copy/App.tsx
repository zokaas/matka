import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import CookieBot from "react-cookiebot";
import { Layout } from "@opr-finance/layout-flex";
import { iconLibrary } from "@opr-finance/feature-icon-library";
import { Logo } from "@opr-finance/component-logo";
import logo from "./images/logo.png";
import { PipelinePage } from "./pages/PipelinePage";
import { CompletedPage } from "./pages/CompletedPage";
import { RescoringPage } from "./pages/RescoringPage";
import styled from "styled-components";
import {
    body,
    bodyTitle,
    pageTitle,
    textField,
    select,
    checkbox,
    checkboxText,
    button,
    buttonText,
    formError,
    footerContact,
    footerLink,
    footerText,
    footerTitle,
    completedPageBody,
    link,
} from "@opr-finance/theme-flex";
import { PartnerPipelinePage } from "./pages/PartnerPipelinePage";

iconLibrary.initFlex();

const FooterIcon = styled.img`
    width: 24px;
    height: 24px;
    margin: 0 24px 0 0;
`;

const domainGroupId = process.env.REACT_APP_COOKIEBOT_DOMAING_GROUP_ID as string;

const App: React.FC = () => {
    return (
        <Layout
            styleConfig={{
                footerTitle: footerTitle(),
                footerLink: footerLink(),
                footerText: footerText(),
                footerContact: footerContact(),
            }}
            icons={{
                time: <FooterIcon src="yritysluotto-flex-joustoluotto-aukiolo.svg" />,
                phone: <FooterIcon src="yritysluotto-flex-joustoluotto-puhelin.svg" />,
                email: <FooterIcon src="yritysluotto-flex-joustoluotto-posti-1.svg" />,
                faq: <FooterIcon src="yritysluotto-flex-joustoluotto-UKK.svg" />,
            }}
            translation={{
                footer: {
                    customerServiceTitle: "Asiakaspalvelu",
                    customerServiceLine1: "Avoinna arkisin 9–17",
                    customerServiceLine2: "020 741 2032",
                    customerServiceLine3: "asiakaspalvelu.flex@yritysluotto.fi",
                    customerServiceLine4: "Usein kysyttyä",
                    customerServiceLink: `${
                        process.env.REACT_APP_MARKETING_PAGE_URL as string
                    }/asiakaspalvelu/usein-kysyttya/`,
                    contactTitle: "Yhteystiedot",
                    contactLine1: "OPR-Finance B2B Oy",
                    contactLine2: "Lautatarhankatu 8B",
                    contactLine3: "00580 Helsinki",
                    contactLine4: "Y-tunnus 2494620-4",
                },
            }}
            logo={
                <Logo
                    logoSrc={logo}
                    width={165}
                    height={55}
                    onClick={() => {
                        window.location.href = process.env.REACT_APP_MARKETING_PAGE_URL as string;
                    }}
                />
            }>
            <CookieBot domainGroupId={domainGroupId} />
            <Switch>
                <Route
                    path="/fi"
                    exact
                    render={() => {
                        return <Redirect to="/" />;
                    }}
                />
                <Route
                    path="/"
                    exact
                    render={() => {
                        return (
                            <PipelinePage
                                styleConfig={{
                                    body: body(),
                                    bodyTitle: bodyTitle(),
                                    pageTitle: pageTitle(),
                                    textField: textField(),
                                    select: select(),
                                    checkbox: checkbox(),
                                    checkboxText: checkboxText(),
                                    button: button(),
                                    buttonText: buttonText(),
                                    formError: formError(),
                                }}
                            />
                        );
                    }}
                />
                <Route
                    path="/partner"
                    exact
                    render={() => {
                        return (
                            <PartnerPipelinePage
                                brokerName="fortis"
                                styleConfig={{
                                    body: body(),
                                    bodyTitle: bodyTitle(),
                                    pageTitle: pageTitle(),
                                    textField: textField(),
                                    select: select(),
                                    checkbox: checkbox(),
                                    checkboxText: checkboxText(),
                                    button: button(),
                                    buttonText: buttonText(),
                                    formError: formError(),
                                }}
                            />
                        );
                    }}
                />
                <Route
                    path="/swiftdial"
                    exact
                    render={() => {
                        return (
                            <PartnerPipelinePage
                                brokerName="swiftdial"
                                styleConfig={{
                                    body: body(),
                                    bodyTitle: bodyTitle(),
                                    pageTitle: pageTitle(),
                                    textField: textField(),
                                    select: select(),
                                    checkbox: checkbox(),
                                    checkboxText: checkboxText(),
                                    button: button(),
                                    buttonText: buttonText(),
                                    formError: formError(),
                                }}
                            />
                        );
                    }}
                />
                <Route
                    path="/korotushakemus"
                    exact
                    render={() => {
                        return (
                            <RescoringPage
                                styleConfig={{
                                    body: body(),
                                    bodyTitle: bodyTitle(),
                                    pageTitle: pageTitle(),
                                    textField: textField(),
                                    select: select(),
                                    checkbox: checkbox(),
                                    checkboxText: checkboxText(),
                                    button: button(),
                                    buttonText: buttonText(),
                                    formError: formError(),
                                }}
                            />
                        );
                    }}
                />
                <Route
                    path="/completed"
                    render={() => {
                        return (
                            <CompletedPage
                                styleConfig={{
                                    body: completedPageBody(),
                                    pageTitle: pageTitle(),
                                    link: link(),
                                }}
                            />
                        );
                    }}
                />
            </Switch>
        </Layout>
    );
};

export default App;
