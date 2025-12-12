import { Container } from "@opr-finance/styled-components";
import { componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_FooterContainerProps } from "./types";
import { footerItems } from "./FooterItems";

const FooterContent = (props: T_FooterContainerProps) => {
    const { footerStyles } = componentStyles;
    return (
        <Container styles={footerStyles.footerContentContainer}>
            {footerItems.map((Component) => (
                <Container styles={footerStyles.footerItemContainer} key={Component.displayName}>
                    <Component />
                </Container>
            ))}
        </Container>
    );
};

export default FooterContent;
