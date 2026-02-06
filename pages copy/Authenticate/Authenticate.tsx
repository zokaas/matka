import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { E_Routes } from "../../types";
import { T_AuthenticateProps } from "./authenticate.types";
import { Loader } from "@opr-finance/styled-components";

export const Authenticate = (props: T_AuthenticateProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(E_Routes.APPLICATION);
    }, []);

    return <Loader size={"3x"} color={"black"} icon={["far", "loader"]} styles={""} />;
};
