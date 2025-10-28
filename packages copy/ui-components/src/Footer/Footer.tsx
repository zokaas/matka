import React from "react";
import { T_Footer } from "./footerTypes";

export const Footer: React.FC<T_Footer> = ({ footer }) => {
    const {
        customerServiceLabel,
        customerServiceText,
        contactInfoLabel,
        contactInfoText,
        addressLabel,
        addressText,
    } = footer;

    return (
        <footer className="w-full bg-neutral text-neutral-content py-10 mt-auto">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex flex-col md:flex-row justify-between gap-8 text-left">
                    <div className="flex-1 min-w-[200px]">
                        <h2 className="text-lg font-bold mb-3">{customerServiceLabel}</h2>
                        <p className="text-sm opacity-80">{customerServiceText}</p>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <h2 className="text-lg font-bold mb-3">{contactInfoLabel}</h2>
                        <p className="text-sm opacity-80">{contactInfoText}</p>
                    </div>
                    <div className="flex-1 min-w-[200px]">
                        <h2 className="text-lg font-bold mb-3">{addressLabel}</h2>
                        <p className="text-sm opacity-80">{addressText}</p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
