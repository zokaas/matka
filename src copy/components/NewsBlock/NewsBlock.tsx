import React from "react";
import { useIntl } from "react-intl";

import { StyledGrid } from "@opr-finance/component-grid";
import { RecentNews } from "@opr-finance/feature-contentful";
import { NewsStyles, ModalStyles, FrontPageStyles } from "@opr-finance/theme-flex-online";

import { messages } from "../../pages/Frontpage/messages";

export function NewsBlock() {
    const { formatMessage: fm } = useIntl();

    return (
        <StyledGrid styleConfig={{ root: FrontPageStyles.newsContainer() }}>
            <RecentNews
                translation={{
                    title: fm(messages.recentNewsTitle),
                    readMore: fm(messages.recentNewsReadMore),
                }}
                styleConfig={{
                    heading: NewsStyles.heading(),
                    newsWrapper: NewsStyles.newsWrapper(),
                    headlines: NewsStyles.headlines({ textAlign: "left" }),
                    headlinesModal: NewsStyles.headlines({ textAlign: "center" }),
                    newsDate: NewsStyles.newsDate({ textAlign: "left" }),
                    newsDateModal: NewsStyles.newsDate({ textAlign: "center" }),
                    news: NewsStyles.news({ textAlign: "left" }),
                    newsModal: NewsStyles.news({ textAlign: "left" }),
                    seeMore: NewsStyles.seeMore(),
                    modalTitle: ModalStyles.modalTitle(),
                    titleText: ModalStyles.titleText(),
                    modalCloseIcon: ModalStyles.modalCloseIcon(),
                    modalOverlay: ModalStyles.modalOverlay(),
                    modalContent: ModalStyles.modalContent(),
                }}
            />
        </StyledGrid>
    );
}
