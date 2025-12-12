import { css } from "@styled-system/css";

import { Container, Icon } from "@opr-finance/styled-components";
import { sideNavigationStyles } from "@opr-finance/themes/sweden-foretagslan-application/componentsStyles";
import { T_SideNavigationIconProps } from "./types";

export const ItemIcon = (props: T_SideNavigationIconProps) => {
    if (props.currentForm === props.name) {
        return (
            <Container styles={sideNavigationStyles.itemIconBox}>
                <Icon
                    style={css(sideNavigationStyles.editIcon)()}
                    icon={["fas", "pencil"]}
                    size="1x"
                />
            </Container>
        );
    } else if (props.validForms.includes(props.name)) {
        return (
            <Container styles={sideNavigationStyles.itemIconBox}>
                <Icon
                    style={css(sideNavigationStyles.checkIcon)()}
                    size="1x"
                    icon={["fas", "check"]}
                />
            </Container>
        );
    } else if (!props.blurredForms.includes(props.name)) {
        return <Container styles={sideNavigationStyles.itemIconBox}></Container>;
    } else
        return (
            <Container styles={sideNavigationStyles.itemIconBox}>
                <Icon style={css(sideNavigationStyles.banIcon)()} icon={["fas", "ban"]} size="1x" />
            </Container>
        );
};
