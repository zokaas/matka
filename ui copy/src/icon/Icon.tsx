import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { byPrefixAndName } from "@awesome.me/kit-f1ba5d0607/icons";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { T_IconProps } from "./types";

export const Icon: React.FC<T_IconProps> = ({ iconName, iconPrefix, className }) => {
    // Workaround as there is some bug with types in FontAwesome
    // HINT: https://docs.fontawesome.com/web/use-with/react/add-icons#workaround
    const icon: IconProp = byPrefixAndName[iconPrefix][iconName] as IconProp;

    return <FontAwesomeIcon icon={icon} className={className} />;
};
