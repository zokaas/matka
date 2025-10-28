import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { T_Tooltip } from "./tooltipTypes";
import { faQuestionCircle } from "@awesome.me/kit-60ea292f8c/icons/classic/regular";

export const Tooltip: React.FC<T_Tooltip> = ({ content, className = "" }) => {
    const [visible, setVisible] = useState(false);

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={() => setVisible(true)}
            onMouseLeave={() => setVisible(false)}
            tabIndex={0}>
            <FontAwesomeIcon
                icon={faQuestionCircle}
                className="text-black cursor-pointer text-xl"
            />
            {visible && (
                <div
                    className={`absolute z-10 bg-white text-black p-2 border border-gray-300 shadow min-w-64 max-w-[600px] md:max-w-[800px] whitespace-normal break-normal left-1/2 transform -translate-x-1/2`}>
                    {content}
                </div>
            )}
        </div>
    );
};
