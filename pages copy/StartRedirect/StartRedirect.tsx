import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { E_Routes } from "../../types";

function StartRedirect() {
    const navigate = useNavigate();
    let { uuid } = useParams();
    const url = window.location;
    const search = url.search;
    if (uuid) {
        localStorage.setItem("applicationUuid", uuid);
    }

    useEffect(() => {
        if (uuid) navigate(`${E_Routes.START}${search}`);
        if (!uuid) navigate(E_Routes.ERROR);
    }, []);
    return <div></div>;
}

export default StartRedirect;
