import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { headerStyles, headerContentContainer, headerTitle, headerLogoContainer, headerLogoImage, } from "./styles";
import { Container } from "@ui/container";
export const Header = (props) => {
    return (_jsx("header", { className: headerStyles, children: _jsxs(Container, { className: headerContentContainer, children: [_jsx(Container, { className: headerLogoContainer, children: _jsx("img", { className: headerLogoImage, src: props.logoSrc }) }), props.title && (_jsx(Container, { children: _jsx("h1", { className: headerTitle, children: props.title }) }))] }) }));
};
