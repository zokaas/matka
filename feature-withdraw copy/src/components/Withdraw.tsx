import React, { ReactNode, KeyboardEvent } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";

import { Text } from "@opr-finance/component-fonts";
import { TextInput } from "@opr-finance/component-forms";
import { Button } from "@opr-finance/component-button";
import { yupResolver } from "@hookform/resolvers/yup";
import { Icon } from "@opr-finance/component-icon";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { Container, ItemContainer, Item, Root, RootContent } from "./Withdraw.styled";

const logger = new ConsoleLogger({ level: LOG_LEVEL });

export type WithdrawProps = {
    defaultValue: number;
    increment: number;
    min: number;
    max: number;
    onSubmit: (value: number) => void;
    plusIcon: ReactNode;
    minusIcon: ReactNode;
    unit: string;
    isLoading?: boolean;
    translation: {
        title: string;
        buttonText: string;
        iban: ReactNode;
        validationMax: string;
        validationInsufficientBalance: string;
    };
};

export type Form = {
    value: string;
};

export function Withdraw(props: WithdrawProps) {
    const schema = yup.object().shape({
        value: yup.string().min(props.min).max(props.max).required(),
    });
    const { handleSubmit, setValue, control, getValues, watch } = useForm<Form>({
        resolver: yupResolver(schema),
        mode: "onBlur",
        defaultValues: {
            value: `${props.defaultValue.toString()} ${props.unit}`,
        },
    });
    const rounder = (value: number): number => {
        return Math.round(value / props.increment) * props.increment;
    };
    const process = (): string => {
        const values: Form = getValues();
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
    const onSubmit = (data: Form) => {
        const value = process();
        setValue("value", value);
        props.onSubmit(parseInt(value));
    };
    const watcher = watch("value");
    const value = parseInt(watcher);
    logger.log("got value", value);

    function isDisabled(props: WithdrawProps): boolean {
        if (props.isLoading) return true;

        return props.max < props.min;
    }

    return (
        <Root>
            <form onSubmit={handleSubmit(onSubmit)}>
                <RootContent>
                    <Text variant="body" fontSize="18px" marginBottom="10px">
                        {props.translation.title}
                    </Text>
                </RootContent>
                <RootContent>
                    <Container>
                        <ItemContainer>
                            {value > props.min && (
                                <Item
                                    onClick={() => {
                                        const values: Form = getValues();
                                        let newValue = parseInt(values.value) - props.increment;
                                        if (newValue < props.min) {
                                            newValue = props.min;
                                        }
                                        setValue("value", `${newValue.toString()} ${props.unit}`);
                                    }}>
                                    {props.minusIcon}
                                </Item>
                            )}
                        </ItemContainer>
                        <Item>
                            <Controller
                                name="value"
                                control={control}
                                render={() => {
                                    return (
                                        <TextInput
                                            variant="glowing"
                                            defaultValue={props.defaultValue.toString()}
                                            onBlur={() => {
                                                setValue("value", process());
                                            }}
                                            onKeyDown={(e: KeyboardEvent) => {
                                                e.key === "Enter" && e.preventDefault();
                                            }}
                                            onChange={(e) => {
                                                setValue("value", `${e.target.value}`);
                                            }}
                                            value={getValues().value}
                                        />
                                    );
                                }}
                            />
                        </Item>
                        <ItemContainer>
                            {value < props.max && (
                                <Item
                                    onClick={() => {
                                        const values: Form = getValues();
                                        let newValue = parseInt(values.value) + props.increment;
                                        if (newValue >= props.max) {
                                            newValue = props.max;
                                        }
                                        setValue("value", `${newValue.toString()} ${props.unit}`);
                                    }}>
                                    {props.plusIcon}
                                </Item>
                            )}
                        </ItemContainer>
                    </Container>
                </RootContent>
                <RootContent>
                    {value === props.max && (
                        <Text variant="formError">{props.translation.validationMax}</Text>
                    )}
                    {props.max < props.min && (
                        <Text variant="formError" textAlign="center">
                            {props.translation.validationInsufficientBalance}
                        </Text>
                    )}
                    <Button
                        variant="primary"
                        marginTop={value === props.max || props.max < props.min ? "0px" : "24px"}
                        marginBottom="24px"
                        disabled={isDisabled(props)}
                        onClick={() => {
                            const values: Form = getValues();
                            let value = process();
                            setValue("value", value);
                            if (parseInt(values.value) <= props.max) {
                                props.onSubmit(parseInt(value));
                            }
                        }}>
                        {props.translation.buttonText}
                        {props.isLoading && <Icon icon={["fas", "circle-notch"]} spin />}
                    </Button>
                    <Text variant="body" marginBottom="40px">
                        {props.translation.iban}
                    </Text>
                </RootContent>
            </form>
        </Root>
    );
}
