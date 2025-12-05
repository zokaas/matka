import React from "react";
import {
    footerStyle,
    footerSectionContainerStyle,
    footerSectionStyle,
    footerHeadingStyle,
    footerTextStyle,
} from "./styles";
import { T_FooterProps } from "./types";

export const Footer: React.FC<T_FooterProps> = ({ footer }) => {
    const {
        customerServiceLabel,
        customerServiceText,
        contactInfoLabel,
        contactInfoText,
        addressLabel,
        addressText,
    } = footer;

    return (
        <footer className={footerStyle}>
            <div className={footerSectionContainerStyle}>
                <div className={footerSectionStyle}>
                    <h2 className={footerHeadingStyle}>{customerServiceLabel}</h2>
                    <p className={footerTextStyle}>{customerServiceText}</p>
                </div>
                <div className={footerSectionStyle}>
                    <h2 className={footerHeadingStyle}>{contactInfoLabel}</h2>
                    <p className={footerTextStyle}>{contactInfoText}</p>
                </div>
                <div className={footerSectionStyle}>
                    <h2 className={footerHeadingStyle}>{addressLabel}</h2>
                    <p className={footerTextStyle}>{addressText}</p>
                </div>
            </div>
        </footer>
    );
};
