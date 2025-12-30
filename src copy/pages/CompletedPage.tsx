import { FontStyleProps } from "@opr-finance/utils";
import { Font } from "@opr-finance/component-fonts";
import { Link } from "@opr-finance/component-link-to";
import { T_ApplicationSent } from "../types/general";
import { useLocation } from "react-router-dom";

import styled from "styled-components";

export const Root = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

export type CompletedPageProps = {
    styleConfig: {
        pageTitle: FontStyleProps;
        body: FontStyleProps;
        link: FontStyleProps;
    };
};

export function CompletedPage(props: CompletedPageProps) {
    const { state } = useLocation<T_ApplicationSent>();
    const navigate = state.partner ? "/financed" : "/"; // Partner is called Financed
    return (
        <Root>
            <Font styleConfig={{ root: props.styleConfig.pageTitle }}>Tack för din ansökan!</Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                Vi handlägger ansökningar vardagar kl. 9–16:00.
            </Font>

            <Font styleConfig={{ root: props.styleConfig.body }}>
                Ditt kreditbeslut samt kreditavtal skickas till din angivna e-postadress för
                signering med mobilt BankID. Efter signering har du fri möjlighet att nyttja din nya
                företagskredit.
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                Kontakta vår kundtjänst om du har frågor:
                <br />
                Telefon 08 501 006 60
                <br />
                Email:{" "}
                <Link styleConfig={{ root: props.styleConfig.link }}>
                    flex.kundservice@opr-foretagslan.se
                </Link>
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                Kundtjänsten är öppen vardagar kl. 9–16:00.
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                <Link styleConfig={{ root: props.styleConfig.link }} href={navigate}>
                    Gå tillbaka till formuläret
                </Link>
            </Font>
        </Root>
    );
}
