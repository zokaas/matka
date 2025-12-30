import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useIntl } from "react-intl";

import { StyledPageTitle } from "@opr-finance/component-content";
import { StyledGrid } from "@opr-finance/component-grid";
import { ButtonStyles, StartPageStyles } from "@opr-finance/theme-flex-online";
import { loginSessionActions } from "@opr-finance/feature-login-session";
import { StyledButton } from "@opr-finance/component-button";
import { AppLoader } from "@opr-finance/feature-loader";
import { FeatureNoticesState, NoticesFields } from "@opr-finance/feature-contentful";

import { StartPageProps } from "./types";
import { messages } from "./messages";
import { Notice } from "../../components/Notice";

import logo from "../../images/bitmap.png";
import { AppState } from "../../types/general";
import { onComponentMounted } from "../../utils";

export function StartPage(props: StartPageProps) {
    const { formatMessage: fm } = useIntl();
    const dispatch = useDispatch();

    const [bankChosen, setBankChosen] = useState<boolean>(false);

    function handleClick() {
        dispatch(
            loginSessionActions.loginSessionTrigger({
                method: "ftn-op-auth",
                instance: "flex-online-sweden",
            })
        );
        setBankChosen(true);
    }

    const { notices } = useSelector((state: FeatureNoticesState) => state?.notices);

    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    useEffect(() => {
        onComponentMounted(boardMemberId);
    }, []);

    return (
        <StyledGrid styleConfig={{ root: StartPageStyles.startPageRootStyles() }}>
            {notices &&
                notices.length > 0 &&
                notices.map((notice: NoticesFields) => (
                    <StyledGrid
                        styleConfig={{ root: StartPageStyles.startPageNoticeListContainer() }}>
                        <Notice
                            notice={notice.notice}
                            styleConfig={{
                                noticeContainer: StartPageStyles.startPageNoticeContainer({
                                    label: notice.label,
                                }),
                                notice: StartPageStyles.startPageNotice(),
                            }}
                        />
                    </StyledGrid>
                ))}
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            {bankChosen ? (
                <AppLoader />
            ) : (
                <StyledGrid styleConfig={{ root: StartPageStyles.startPageContainer() }}>
                    <StyledGrid styleConfig={{ root: StartPageStyles.bankIdContainer() }}>
                        <StyledButton
                            styleConfig={{
                                root: ButtonStyles.whiteButtonStyles({
                                    width: "212px",
                                    height: "172px",
                                }),
                            }}
                            onClick={handleClick}>
                            <img src={logo} alt={"bankId logo"} />
                        </StyledButton>
                    </StyledGrid>
                </StyledGrid>
            )}
        </StyledGrid>
    );
}
