import React, { useState } from "react";
import { useIntl } from "react-intl";
import { Route, Switch, useRouteMatch, useHistory, useLocation } from "react-router-dom";

import { E_Routes } from "../../types/general";

const DeterminePage = (path: string) => useRouteMatch({ path, strict: true, sensitive: true });
let isMorePageVisible = false;

export type T_IconProporties = {
    icon: string;
    text: string;
    route?: string;
    isMoreIcon?: boolean;
};

export type T_NavItems = {
    linkTo: string;
    navigationText: string;
};
