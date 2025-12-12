import { Button, Container, Font } from "@opr-finance/styled-components";
import { applicationPageStyles } from "@opr-finance/themes/sweden-foretagslan-application/pageStyles";
import { buttonStyles } from "@opr-finance/themes/sweden-foretagslan-application/componentsStyles";

type T_ForbiddenPageProps = {
    state: any;
    navigateToMarketingPage: () => void;
    navigateToLogin: () => void;
};

function ForbiddenPage(props: Readonly<T_ForbiddenPageProps>) {
    const bodyMessage = () => {
        if (props.state && props.state.source === "ssn-check") {
            return (
                <>
                    <Font styles={applicationPageStyles.blockHeading}>
                        Endast sökande som har ansökt via en låneförmedlare kan ta sig vidare till
                        nästa steg.
                    </Font>
                    <Font styles={applicationPageStyles.blockBody}>
                        Vänligen be sökande att slutföra erbjudandet från oss.
                    </Font>
                    <Font styles={applicationPageStyles.blockBody}>
                        Med vänlig hälsning <br />
                        OPR-Företagslån
                    </Font>
                </>
            );
        }
        return (
            <>
                <Font styles={applicationPageStyles.blockHeading}>Din ansökan har nekats!</Font>
                <Font styles={applicationPageStyles.blockBody}>
                    Ett företagslån kan ansökas av ansvarig person på företaget som har rätt att
                    teckna ensam eller tillsammans med annan person.
                </Font>
                <Font styles={applicationPageStyles.blockBody}>
                    Enligt bolagets firmateckning verkar det som att du inte har rätt att teckna för
                    det företag som du ansöker om lån för.
                </Font>
                <Font styles={applicationPageStyles.blockBody}>
                    Kontrollera företagets uppgifter med låneansökan och ansök om lånet igen.
                </Font>
                <Font styles={applicationPageStyles.blockBody}>
                    Om du har några frågor, vänligen kontakta vår kundservice:
                </Font>
                <Font styles={applicationPageStyles.blockBody}>Tel. 08 501 006 60</Font>
                <Font styles={applicationPageStyles.blockBody}>
                    E-post: kundservice@opr-foretagslan.se
                </Font>
                <Font styles={applicationPageStyles.blockBody}>
                    Vår kundservice är öppen vardagar från 9.00 till 16.00
                </Font>
            </>
        );
    };
    return (
        <Container styles={applicationPageStyles.formBlock}>
            {bodyMessage()}
            <Container styles={applicationPageStyles.buttonBlock}>
                <Button
                    styles={buttonStyles.buttonStyles({ width: "250px" })}
                    onClick={props.navigateToMarketingPage}>
                    Tillbaka till startsidan
                </Button>
                <Button
                    styles={buttonStyles.buttonStyles({ width: "250px" })}
                    onClick={props.navigateToLogin}>
                    Tillbaka till Inloggningssidan
                </Button>
            </Container>
        </Container>
    );
}

export default ForbiddenPage;
