import React from "react";
import { T_TitleProps } from "./types";

export const Title: React.FC<T_TitleProps> = ({
    className,
    subtitle,
    subtitleClassName,
    title,
    titleClassName,
}) => {
    return (
        <div className={className}>
            {title && <h2 className={titleClassName}>{title}</h2>}
            {subtitle && <p className={subtitleClassName}>{subtitle}</p>}
        </div>
    );
};
