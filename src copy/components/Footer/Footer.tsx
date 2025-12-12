import { Container } from "@opr-finance/styled-components";
import { componentStyles } from "@opr-finance/themes/sweden-foretagslan-application";

import { T_FooterProps } from "./types";
import FooterContent from "./FooterContent";

const Footer = (props: T_FooterProps) => {
    const { footerStyles } = componentStyles;
    return (
        <Container styles={footerStyles.footerContainer}>
            <Container styles={footerStyles.footerContentWrapper}>
                <FooterContent />
            </Container>
        </Container>
    );
};

export default Footer;
