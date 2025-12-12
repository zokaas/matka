import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { E_Routes } from "../../types";
import { T_AuthenticateProps } from "./authenticate.types";

export const Authenticate = (props: T_AuthenticateProps) => {
    const navigate = useNavigate();

    useEffect(() => {
        navigate(E_Routes.APPLICATION);
    }, []);

    return <div>Loading...</div>;
};
