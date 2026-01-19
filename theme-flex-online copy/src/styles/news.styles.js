"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.heading = heading;
exports.newsWrapper = newsWrapper;
exports.headlines = headlines;
exports.newsDate = newsDate;
exports.news = news;
exports.seeMore = seeMore;
const general_1 = require("../general");
function heading() {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "24px",
        textAlign: "center",
        fontWeight: 600,
    };
}
function newsWrapper() {
    return {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        margin: "20px 0 10px 0",
    };
}
function headlines({ textAlign }) {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "16px",
        textAlign: ["left", textAlign],
        margin: "10px 0",
    };
}
function newsDate({ textAlign }) {
    return {
        color: general_1.E_Colors.NEWS_DATE,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "12px",
        textAlign: ["left", textAlign],
        marginBottom: "10px",
    };
}
function news({ textAlign }) {
    return {
        color: general_1.E_Colors.PRIMARY,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "12px",
        textAlign: ["left", textAlign],
        margin: "10px 0",
    };
}
function seeMore() {
    return {
        color: general_1.E_Colors.LINK,
        fontFamily: general_1.E_Fonts.FONT_FAMILY,
        fontSize: "12px",
        textAlign: "left",
    };
}
//# sourceMappingURL=news.styles.js.map