"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Withdraw = Withdraw;
const react_1 = __importDefault(require("react"));
const react_hook_form_1 = require("react-hook-form");
const yup = __importStar(require("yup"));
const component_fonts_1 = require("@opr-finance/component-fonts");
const component_forms_1 = require("@opr-finance/component-forms");
const component_button_1 = require("@opr-finance/component-button");
const yup_1 = require("@hookform/resolvers/yup");
const component_icon_1 = require("@opr-finance/component-icon");
const feature_console_logger_1 = require("@opr-finance/feature-console-logger");
const Withdraw_styled_1 = require("./Withdraw.styled");
const logger = new feature_console_logger_1.ConsoleLogger({ level: feature_console_logger_1.LOG_LEVEL });
function Withdraw(props) {
    const schema = yup.object().shape({
        value: yup.string().min(props.min).max(props.max).required(),
    });
    const { handleSubmit, setValue, control, getValues, watch } = (0, react_hook_form_1.useForm)({
        resolver: (0, yup_1.yupResolver)(schema),
        mode: "onBlur",
        defaultValues: {
            value: `${props.defaultValue.toString()} ${props.unit}`,
        },
    });
    const rounder = (value) => {
        return Math.round(value / props.increment) * props.increment;
    };
    const process = () => {
        const values = getValues();
        let value = rounder(parseInt(values.value));
        logger.log("got value to process", value);
        if (isNaN(value)) {
            value = props.min;
        }
        if (value >= props.max) {
            value = props.max;
        }
        if (value < props.min) {
            value = props.min;
        }
        logger.log("got final value", value);
        return `${value.toString()} ${props.unit}`;
    };
    const onSubmit = (data) => {
        const value = process();
        setValue("value", value);
        props.onSubmit(parseInt(value));
    };
    const watcher = watch("value");
    const value = parseInt(watcher);
    logger.log("got value", value);
    function isDisabled(props) {
        if (props.isLoading)
            return true;
        return props.max < props.min;
    }
    return (react_1.default.createElement(Withdraw_styled_1.Root, null,
        react_1.default.createElement("form", { onSubmit: handleSubmit(onSubmit) },
            react_1.default.createElement(Withdraw_styled_1.RootContent, null,
                react_1.default.createElement(component_fonts_1.Text, { variant: "body", fontSize: "18px", marginBottom: "10px" }, props.translation.title)),
            react_1.default.createElement(Withdraw_styled_1.RootContent, null,
                react_1.default.createElement(Withdraw_styled_1.Container, null,
                    react_1.default.createElement(Withdraw_styled_1.ItemContainer, null, value > props.min && (react_1.default.createElement(Withdraw_styled_1.Item, { onClick: () => {
                            const values = getValues();
                            let newValue = parseInt(values.value) - props.increment;
                            if (newValue < props.min) {
                                newValue = props.min;
                            }
                            setValue("value", `${newValue.toString()} ${props.unit}`);
                        } }, props.minusIcon))),
                    react_1.default.createElement(Withdraw_styled_1.Item, null,
                        react_1.default.createElement(react_hook_form_1.Controller, { name: "value", control: control, render: () => {
                                return (react_1.default.createElement(component_forms_1.TextInput, { variant: "glowing", defaultValue: props.defaultValue.toString(), onBlur: () => {
                                        setValue("value", process());
                                    }, onKeyDown: (e) => {
                                        e.key === "Enter" && e.preventDefault();
                                    }, onChange: (e) => {
                                        setValue("value", `${e.target.value}`);
                                    }, value: getValues().value }));
                            } })),
                    react_1.default.createElement(Withdraw_styled_1.ItemContainer, null, value < props.max && (react_1.default.createElement(Withdraw_styled_1.Item, { onClick: () => {
                            const values = getValues();
                            let newValue = parseInt(values.value) + props.increment;
                            if (newValue >= props.max) {
                                newValue = props.max;
                            }
                            setValue("value", `${newValue.toString()} ${props.unit}`);
                        } }, props.plusIcon))))),
            react_1.default.createElement(Withdraw_styled_1.RootContent, null,
                value === props.max && (react_1.default.createElement(component_fonts_1.Text, { variant: "formError" }, props.translation.validationMax)),
                props.max < props.min && (react_1.default.createElement(component_fonts_1.Text, { variant: "formError", textAlign: "center" }, props.translation.validationInsufficientBalance)),
                react_1.default.createElement(component_button_1.Button, { variant: "primary", marginTop: value === props.max || props.max < props.min ? "0px" : "24px", marginBottom: "24px", disabled: isDisabled(props), onClick: () => {
                        const values = getValues();
                        let value = process();
                        setValue("value", value);
                        if (parseInt(values.value) <= props.max) {
                            props.onSubmit(parseInt(value));
                        }
                    } },
                    props.translation.buttonText,
                    props.isLoading && react_1.default.createElement(component_icon_1.Icon, { icon: ["fas", "circle-notch"], spin: true })),
                react_1.default.createElement(component_fonts_1.Text, { variant: "body", marginBottom: "40px" }, props.translation.iban)))));
}
//# sourceMappingURL=Withdraw.js.map