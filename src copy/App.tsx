import React from "react";
import { Route, Switch } from "react-router-dom";
import { Layout } from "@opr-finance/layout-flex";
import { iconLibrary } from "@opr-finance/feature-icon-library";
import { Logo } from "@opr-finance/component-logo";
import logo from "./images/logo.svg";
import { PipelinePage } from "./pages/PipelinePage";
import { CompletedPage } from "./pages/CompletedPage";
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
                    customerServiceTitle: "Kundtjänst",
                    customerServiceLine1: "Öppen vardagar kl. 9–16:00",
                    customerServiceLine2: "08 501 006 60",
                    customerServiceLine3: "flex.kundservice@opr-foretagslan.se",
                    customerServiceLine4: "Vanliga frågor",
                    customerServiceLink: `${
                        process.env.REACT_APP_MARKETING_PAGE_URL as string
                    }/kundservice/vanliga-fragor/`,
                    contactTitle: "Kontaktuppgifter",
                    contactLine1: "OPR- Finance AB",
                    contactLine2: "Kungsbroplan 1",
                    contactLine3: "112 27 Stockholm",
                    contactLine4: "Organisationsnummer: 556707-7044",
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
            <Switch>
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
                                    contractLink: link(),
                                }}
                            />
                        );
                    }}
                />
                <Route
                    path="/financed" // Partner is called Financed
                    exact
                    render={() => {
                        return (
                            <PartnerPipelinePage
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
                                    contractLink: link(),
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
