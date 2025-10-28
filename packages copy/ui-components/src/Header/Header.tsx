import React, { useEffect, useState } from "react";
import { T_Header } from "./headerTypes";

export const Header: React.FC<T_Header> = ({ title }) => {
    const fallbackLogo = "/logos/t.svg";
    const [logoSrc, setLogoSrc] = useState(fallbackLogo);

    useEffect(() => {
        const theme = document.documentElement.getAttribute("data-theme");
        if (theme) {
            setLogoSrc(`/logos/t.svg`);
        }
    }, []);

    return (
        <header className="w-full min-h-[76px] bg-base-100 shadow-strong z-10 relative">
            <div className="h-full w-full max-w-[976px] mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <div className="flex-shrink-0">
                    <img
                        src={logoSrc}
                        alt="Logo"
                        onError={() => setLogoSrc(fallbackLogo)}
                        className="h-12 w-auto object-contain"
                    />
                </div>

                {/* Title */}
                {title && (
                    <h1 className="text-lg md:text-xl lg:text-2xl font-semibold text-base-content ml-4">
                        {title}
                    </h1>
                )}
            </div>
        </header>
    );
};
