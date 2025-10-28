import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from "react";
export const Header = ({ title }) => {
    const fallbackLogo = "/logos/t.svg";
    const [logoSrc, setLogoSrc] = useState(fallbackLogo);
    useEffect(() => {
        const theme = document.documentElement.getAttribute("data-theme");
        if (theme) {
            setLogoSrc(`/logos/t.svg`);
        }
    }, []);
    return (_jsx("header", { className: "w-full min-h-[76px] bg-base-100 shadow-strong z-10 relative", children: _jsxs("div", { className: "h-full w-full max-w-[976px] mx-auto px-4 md:px-6 flex items-center justify-between", children: [_jsx("div", { className: "flex-shrink-0", children: _jsx("img", { src: logoSrc, alt: "Logo", onError: () => setLogoSrc(fallbackLogo), className: "h-12 w-auto object-contain" }) }), title && (_jsx("h1", { className: "text-lg md:text-xl lg:text-2xl font-semibold text-base-content ml-4", children: title }))] }) }));
};
