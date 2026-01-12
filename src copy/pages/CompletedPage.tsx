import { useLocation } from "react-router-dom";
import { FontStyleProps } from "@opr-finance/utils";
import { Font } from "@opr-finance/component-fonts";
import { Link } from "@opr-finance/component-link-to";
import { T_ApplicationSent } from "../types/general";

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
    const navigate = state.partner ? "/partner" : "/fi";
    return (
        <Root>
            <Font styleConfig={{ root: props.styleConfig.pageTitle }}>Kiitos hakemuksestasi!</Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                Käsittelemme hakemuksia arkisin klo 9–17. Annamme luottopäätöksen jo samana päivänä
                klo 16 mennessä saapuneille hakemuksille.
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                {state.type === "rescoring"
                    ? "Lähetämme luottorajan korotukseen liittyvän luottopäätöksen ja päivitetyn lainasopimuksen allekirjoitettavaksesi sähköpostiisi."
                    : "Lähetämme luottopäätöksen ja lainasopimuksen allekirjoitettavaksesi sähköpostiisi."}
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                {state.type === "rescoring"
                    ? " Hyväksyttyäsi lainasopimuksen Yritysluotto Flex joustoluottosi uusi luottoraja on valmis käytettäväksi ja voit tehdä nostoja luottorajasi puitteissa."
                    : "Hyväksyttyäsi lainasopimuksen Yritysluotto Flex joustoluottosi on valmis käytettäväksi ja voit tehdä nostoja luottorajasi puitteissa."}
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                Mikäli sinulla on kysyttävää, ota yhteyttä asiakaspalveluumme:
                <br />
                Puh. 020 741 2032
                <br />
                Email:{" "}
                <Link
                    styleConfig={{ root: props.styleConfig.link }}
                    href="mailto: asiakaspalvelu.flex@yritysluotto.fi">
                    asiakaspalvelu.flex@yritysluotto.fi
                </Link>
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                Asiakaspalvelu on avoinna arkisin klo 9–17
            </Font>
            <Font styleConfig={{ root: props.styleConfig.body }}>
                <Link styleConfig={{ root: props.styleConfig.link }} href={navigate}>
                    Palaa lomakkeeseen
                </Link>
            </Font>
        </Root>
    );
}
