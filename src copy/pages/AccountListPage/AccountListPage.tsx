import React, { useEffect } from "react";
import { useIntl } from "react-intl";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import * as VP from "@opr-finance/api-definitions";
import { StyledGrid } from "@opr-finance/component-grid";
import { AccountListPageStyles, ButtonStyles } from "@opr-finance/theme-flex-online";
import { StyledButton } from "@opr-finance/component-button";
import { Font } from "@opr-finance/component-fonts";
import { StyledPageTitle } from "@opr-finance/component-content";
//import { engagementActions } from "@opr-finance/feature-sme-customer";

import { messages } from "./messages";
import { AppState, E_Routes } from "../../types/general";
import { AccountListPageProps } from "./types";
import { appActions } from "../../actions/actions";
import { onComponentMounted } from "../../utils";

export function AccountListPage(props: AccountListPageProps) {
    const { formatMessage: fm } = useIntl();

    const dispatch = useDispatch();

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);

    const engagements: VP.components["schemas"]["BusinessIndividualEngagement"] | any = useSelector(
        (state: AppState) => state.customer.engagement.engagements
    );

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }
    const handleAccountSelection = (smeId: string) => {
        // dispatch(engagementActions.saveSmeIdSuccess(smeId));
        dispatch(appActions.chooseAccountPageSelected({ smeId }));
    };
    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    useEffect(() => {
        if (boardMemberId && authenticated) onComponentMounted(boardMemberId);
    }, []);

    return (
        <StyledGrid styleConfig={{ root: AccountListPageStyles.accountListPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: AccountListPageStyles.accountListContainerStyles() }}>
                <StyledGrid
                    styleConfig={{ root: AccountListPageStyles.accountListContainerStyles() }}>
                    {engagements &&
                        engagements.map((account, index) => {
                            return (
                                <StyledGrid
                                    styleConfig={{
                                        root: AccountListPageStyles.accountListButtonContainer(),
                                    }}
                                    key={`item-${index}`}>
                                    <StyledButton
                                        onClick={() => handleAccountSelection(account.smeId)}
                                        styleConfig={{
                                            root: ButtonStyles.whiteButtonStyles(),
                                        }}>
                                        <StyledGrid
                                            styleConfig={{
                                                root: AccountListPageStyles.accountStyle(),
                                            }}>
                                            <Font
                                                styleConfig={{
                                                    root: ButtonStyles.whiteButtonFontStyles(),
                                                }}>
                                                {fm(messages.loanNumber)}
                                                {account.organizationNumber}
                                            </Font>
                                            <Font
                                                styleConfig={{
                                                    root: ButtonStyles.whiteButtonFontStyles(),
                                                }}>
                                                {account.companyName}
                                            </Font>
                                        </StyledGrid>
                                    </StyledButton>
                                </StyledGrid>
                            );
                        })}
                </StyledGrid>
            </StyledGrid>
        </StyledGrid>
    );
}
