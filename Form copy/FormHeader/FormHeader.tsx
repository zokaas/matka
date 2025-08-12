import React from "react";
import { T_FormHeaderProps } from "./types/formHeader";

export const FormHeader: React.FC<T_FormHeaderProps> = (props: T_FormHeaderProps) => {
    const { title, subtitle } = props;
    return (
        <div className="text-center mb-8">
            {title && <h2 className="text-3xl font-bold text-base-content mb-2">{title}</h2>}
            {subtitle && <p className="text-base-content/70">{subtitle}</p>}
        </div>
    );
};

export default FormHeader;
