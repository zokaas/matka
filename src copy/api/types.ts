export type T_CheckRightsProps = {
    ssn: string;
    organizationNumber: string;
};

export type T_FunctionOfPerson = {
    appointmentdate: string;
    function: string;
    name: string;
    socsecuritynr: string;
};

export type T_SigningRightsResult = {
    ssn: string;
    personInCompany: boolean;
    company: {
        name: string;
        type: string;
        status: string;
    };
    functions: T_FunctionOfPerson[];
};
