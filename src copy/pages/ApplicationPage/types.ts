import * as VP from "@opr-finance/api-definitions";
import { SystemStyleObject } from "@styled-system/css";

export type T_IndividualGuarantor = VP.components["schemas"]["IndividualGuarantorV8PostRequest"];

export type ApplicationPageProps = {
    styleConfig: {
        titleBox: SystemStyleObject;
        pageTitle: SystemStyleObject;
        titleText: SystemStyleObject;
    };
};
