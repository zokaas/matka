import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIntl } from "react-intl";
import { Redirect } from "react-router-dom";
import * as yup from "yup";

import { StyledGrid } from "@opr-finance/component-grid";
import { StyledPageTitle } from "@opr-finance/component-content";
import { ButtonStyles, FontsStyles, UserPageStyles } from "@opr-finance/theme-flex-online";
import { Font } from "@opr-finance/component-fonts";
import { TextField, useForm } from "@opr-finance/component-forms";
import { isValidPhoneNumberSe } from "@opr-finance/validators";
import { StyledButton } from "@opr-finance/component-button";
import { Icon } from "@opr-finance/component-icon";
import { formatOrgNumSwe } from "@opr-finance/utils";
import { ConsoleLogger, LOG_LEVEL } from "@opr-finance/feature-console-logger";

import { appActions } from "../../actions/actions";
import { UserPageProps, T_UpdateUserInfoFormData } from "./types";
import { messages } from "./messages";
import { AppState, E_Routes } from "../../types/general";
import { onComponentMounted } from "../../utils";

export function UserPage(props: UserPageProps) {
    const logger = new ConsoleLogger({ level: LOG_LEVEL });
    const dispatch = useDispatch();
    const { formatMessage: fm } = useIntl();
    const [editBankAccount, setEditBankAccount] = useState(false);
    const [editEmailAddress, setEditEmailAddress] = useState(false);
    const [editPostAddress, setEditPostAddress] = useState(false);
    const [editPhoneNumber, setEditPhoneNumber] = useState(false);

    const { authenticated, logoutInProgress } = useSelector((state: AppState) => state.session);
    const { info, boardmembers } = useSelector((state: AppState) => state.customer.companyInfo);
    const accountInfo = useSelector((state: AppState) => state.account.account);

    const orgNumber = info?.organizationNumber ? formatOrgNumSwe(info?.organizationNumber) : "";

    const account = accountInfo?.disbursementAccount;

    const [application, setApplication] = useState<T_UpdateUserInfoFormData>({
        phone: "",
        email: "",
        streetAddress: "",
        zipCode: "",
        city: "",
        smeId: "",
    });

    let schema = yup.object().shape({});

    const setCurrentSchema = () => {
        const field = editBankAccount
            ? "bankAccount"
            : editEmailAddress
            ? "email"
            : editPostAddress
            ? "address"
            : editPhoneNumber
            ? "phone"
            : "";

        switch (field) {
            case "bankAccount":
                return (schema = yup.object().shape({
                    //bankAccount: yup.string().required(fm(messages.alertTextRequired))
                }));
            case "email":
                return (schema = yup.object().shape({
                    email: yup
                        .string()
                        .email(fm(messages.wrongEmailErrorMessage))
                        .required(fm(messages.alertTextRequired)),
                }));
            case "phone":
                return (schema = yup.object().shape({
                    phone: yup
                        .string()
                        .test(
                            "isValidPhone",
                            fm(messages.wrongPhoneErrorMessage),
                            isValidPhoneNumberSe
                        )
                        .required(fm(messages.alertTextRequired)),
                }));
            case "address":
                return (schema = yup.object().shape({
                    streetAddress: yup.string().required(fm(messages.alertTextRequired)),
                    zipCode: yup.string().required(fm(messages.alertTextRequired)),
                    city: yup.string().required(fm(messages.alertTextRequired)),
                }));
            default:
                return schema;
        }
    };

    const { form, processChange, processFocus, processBlur, Error, processReset } =
        useForm<T_UpdateUserInfoFormData>({
            initial: {
                phone: info?.phone ? info.phone : "",
                email: info?.email ? info.email : "",
                streetAddress: info?.officialAddress?.streetAddress
                    ? info?.officialAddress?.streetAddress
                    : "",
                zipCode: info?.officialAddress?.zipCode ? info?.officialAddress?.zipCode : "",
                city: info?.officialAddress?.city ? info?.officialAddress?.city : "",
                smeId: info?.id,
            },
            schema: setCurrentSchema(),
            onChange: (data) => {
                setApplication(data);
            },
            onError: () => {},
            onBlur: () => {},
            onFocus: () => {},
            styleConfig: {
                formError: UserPageStyles.formError(),
            },
        });

    const boardMemberId = useSelector((state: AppState) => {
        return state.customer?.companyInfo?.boardmembers
            ? state.customer?.companyInfo?.boardmembers[0].id
            : "";
    });

    useEffect(() => {
        logger.log("USER PAGE MOUNTED");
        onComponentMounted(boardMemberId);
    }, []);

    const handleOnSaveClick = async (fields: string[]) => {
        fields.forEach(async (field) => await processBlur(field));

        if (form.valid) {
            await handleForm();
            return true;
        } else return false;
    };
    async function handleForm() {
        const data = { ...application, smeId: info?.id };
        dispatch(appActions.userInfoUpdateTrigger(data));
    }
    const checkButtonDisabled = (current: string): boolean => {
        const editedFields = [
            { editBankAccount: editBankAccount },
            { editEmailAddress: editEmailAddress },
            { editPhoneNumber: editPhoneNumber },
            { editPostAddress: editPostAddress },
        ];

        const newArray: boolean[] = [];
        editedFields.map((field) => {
            Object.entries(field).forEach((field) => {
                const [key, value] = field;
                newArray.push(key !== current && value);
            });
        });

        const isOtherEdited = newArray.includes(true);
        return isOtherEdited;
    };

    if (!authenticated && !logoutInProgress) {
        return <Redirect to={E_Routes.ROOT} />;
    }

    return (
        <StyledGrid styleConfig={{ root: UserPageStyles.userPageRootStyles() }}>
            <StyledPageTitle
                title={fm(messages.pageTitle)}
                styleConfig={{
                    pageTitleContainer: props.styleConfig.titleBox,
                    pageTitleText: props.styleConfig.pageTitle,
                }}
            />
            <StyledGrid styleConfig={{ root: UserPageStyles.userPageContainer() }}>
                <Font styleConfig={{ root: FontsStyles.fontUserPageTitle() }}>
                    {fm(messages.TopInfo)}{" "}
                </Font>
                <StyledGrid styleConfig={{ root: UserPageStyles.titleAndEditButtonContainer }}>
                    <Font styleConfig={{ root: FontsStyles.fontUserBoxTitle() }}>
                        {fm(messages.companyInfoTitle)}
                    </Font>
                </StyledGrid>
                <StyledGrid styleConfig={{ root: UserPageStyles.userPageFlexContainer() }}>
                    <StyledGrid styleConfig={{ root: UserPageStyles.userPageColumn() }}>
                        <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                            <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                                {fm(messages.companyName)}
                            </Font>
                            <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                                {info?.companyName}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                            <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                                {fm(messages.businessID)}
                            </Font>
                            <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                                {orgNumber}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                            <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                                {fm(messages.textCustomerNumber)}
                            </Font>
                            <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                                {accountInfo?.accountNumber}
                            </Font>
                        </StyledGrid>
                    </StyledGrid>
                    <StyledGrid styleConfig={{ root: UserPageStyles.userPageColumn() }}>
                        <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                            <StyledGrid
                                styleConfig={{ root: UserPageStyles.userPageTextButtonGroup() }}>
                                <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                                    {fm(messages.textSSN)}
                                </Font>
                            </StyledGrid>
                            <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                                {account?.externalAccountNumber}
                            </Font>
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                            <StyledGrid
                                styleConfig={{
                                    root: UserPageStyles.userPageTextButtonGroup(),
                                }}>
                                <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                                    {fm(messages.textEmail)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{
                                        root: UserPageStyles.userPageButtonGroup(),
                                    }}>
                                    <StyledButton
                                        disabled={checkButtonDisabled("editEmailAddress")}
                                        onClick={async () => {
                                            if (editEmailAddress) {
                                                const isSaved = handleOnSaveClick(["email"]);
                                                if (await isSaved) setEditEmailAddress(false);
                                            } else {
                                                setEditEmailAddress(true);
                                            }
                                        }}
                                        styleConfig={{
                                            root: ButtonStyles.greenButtonStyles({
                                                width: "35px",
                                                marginTop: "20px",
                                            }),
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: ButtonStyles.buttonFontStyles(),
                                            }}>
                                            <Icon
                                                icon={[
                                                    "fa",
                                                    editEmailAddress ? "save" : "pencil-alt",
                                                ]}
                                            />{" "}
                                        </Font>
                                    </StyledButton>
                                    {editEmailAddress ? (
                                        <StyledButton
                                            onClick={() => {
                                                setEditEmailAddress(false);
                                                processReset();
                                            }}
                                            styleConfig={{
                                                root: ButtonStyles.grayButtonStyles({
                                                    width: "35px",
                                                    marginTop: "20px",
                                                }),
                                            }}>
                                            <Font
                                                styleConfig={{
                                                    root: ButtonStyles.buttonFontStyles(),
                                                }}>
                                                X
                                            </Font>
                                        </StyledButton>
                                    ) : null}
                                </StyledGrid>
                            </StyledGrid>
                            {editEmailAddress ? (
                                <StyledGrid styleConfig={{ root: UserPageStyles.inputContainer() }}>
                                    <TextField
                                        inputConfig={{
                                            name: "email",
                                            value: form.data.email,
                                            onFocus: () => {
                                                processFocus("email");
                                            },
                                            onChange: (e) => {
                                                processChange({
                                                    field: "email",
                                                    value: e.target.value,
                                                });
                                            },
                                            onBlur: () => {
                                                processBlur("email");
                                            },
                                            onKeyDown: (e) => {
                                                if (e.key === "Enter") {
                                                    processBlur("email");
                                                }
                                            },
                                        }}
                                        styleConfig={{ root: UserPageStyles.textField() }}
                                    />
                                    <Error field="email" />
                                </StyledGrid>
                            ) : (
                                <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                                    {info?.email}
                                </Font>
                            )}
                        </StyledGrid>
                        <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                            <StyledGrid
                                styleConfig={{ root: UserPageStyles.userPageTextButtonGroup() }}>
                                <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                                    {fm(messages.textAddress)}
                                </Font>
                                <StyledGrid
                                    styleConfig={{ root: UserPageStyles.userPageButtonGroup() }}>
                                    <StyledButton
                                        disabled={checkButtonDisabled("editPostAddress")}
                                        onClick={async () => {
                                            if (editPostAddress) {
                                                const isSaved = handleOnSaveClick([
                                                    "streetAddress",
                                                    "zipCode",
                                                    "city",
                                                ]);
                                                if (await isSaved) setEditPostAddress(false);
                                            } else {
                                                setEditPostAddress(true);
                                            }
                                        }}
                                        styleConfig={{
                                            root: ButtonStyles.greenButtonStyles({
                                                width: "35px",
                                                marginTop: "20px",
                                            }),
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: ButtonStyles.buttonFontStyles(),
                                            }}>
                                            <Icon
                                                icon={[
                                                    "fa",
                                                    editPostAddress ? "save" : "pencil-alt",
                                                ]}
                                            />{" "}
                                        </Font>
                                    </StyledButton>
                                    {editPostAddress ? (
                                        <StyledButton
                                            onClick={() => {
                                                setEditPostAddress(false);
                                                processReset();
                                            }}
                                            styleConfig={{
                                                root: ButtonStyles.grayButtonStyles({
                                                    width: "35px",
                                                    marginTop: "20px",
                                                }),
                                            }}>
                                            <Font
                                                styleConfig={{
                                                    root: ButtonStyles.buttonFontStyles(),
                                                }}>
                                                X
                                            </Font>
                                        </StyledButton>
                                    ) : null}
                                </StyledGrid>
                            </StyledGrid>
                            <StyledGrid
                                styleConfig={{ root: UserPageStyles.userPageAddressColumn() }}>
                                {editPostAddress ? (
                                    <>
                                        <StyledGrid
                                            styleConfig={{
                                                root: UserPageStyles.inputContainer(),
                                            }}>
                                            <TextField
                                                inputConfig={{
                                                    name: "streetAddress",
                                                    value: form.data.streetAddress,
                                                    onFocus: () => {
                                                        processFocus("streetAddress");
                                                    },
                                                    onChange: (e) => {
                                                        processChange({
                                                            field: "streetAddress",
                                                            value: e.target.value,
                                                        });
                                                    },
                                                    onBlur: () => {
                                                        processBlur("streetAddress");
                                                    },
                                                    onKeyDown: (e) => {
                                                        if (e.key === "Enter") {
                                                            processBlur("streetAddress");
                                                        }
                                                    },
                                                }}
                                                styleConfig={{
                                                    root: UserPageStyles.textField(),
                                                }}
                                            />
                                            <Error field="streetAddress" />
                                        </StyledGrid>
                                        <StyledGrid
                                            styleConfig={{
                                                root: UserPageStyles.inputContainer(),
                                            }}>
                                            <TextField
                                                inputConfig={{
                                                    name: "zipCode",
                                                    value: form.data.zipCode,
                                                    onFocus: () => {
                                                        processFocus("zipCode");
                                                    },
                                                    onChange: (e) => {
                                                        processChange({
                                                            field: "zipCode",
                                                            value: e.target.value,
                                                        });
                                                    },
                                                    onBlur: () => {
                                                        processBlur("zipCode");
                                                    },
                                                    onKeyDown: (e) => {
                                                        if (e.key === "Enter") {
                                                            processBlur("zipCode");
                                                        }
                                                    },
                                                }}
                                                styleConfig={{
                                                    root: UserPageStyles.textField(),
                                                }}
                                            />
                                            <Error field="zipCode" />
                                        </StyledGrid>
                                        <StyledGrid
                                            styleConfig={{
                                                root: UserPageStyles.inputContainer(),
                                            }}>
                                            <TextField
                                                inputConfig={{
                                                    name: "city",
                                                    value: form.data.city,
                                                    onFocus: () => {
                                                        processFocus("city");
                                                    },
                                                    onChange: (e) => {
                                                        processChange({
                                                            field: "city",
                                                            value: e.target.value,
                                                        });
                                                    },
                                                    onBlur: () => {
                                                        processBlur("city");
                                                    },
                                                    onKeyDown: (e) => {
                                                        if (e.key === "Enter") {
                                                            processBlur("city");
                                                        }
                                                    },
                                                }}
                                                styleConfig={{
                                                    root: UserPageStyles.textField(),
                                                }}
                                            />
                                            <Error field="city" />
                                        </StyledGrid>
                                    </>
                                ) : (
                                    <>
                                        <Font>{info?.officialAddress?.streetAddress}</Font>
                                        <Font>{info?.officialAddress?.zipCode}</Font>
                                        <Font>{info?.officialAddress?.city}</Font>
                                    </>
                                )}
                            </StyledGrid>
                        </StyledGrid>
                    </StyledGrid>
                </StyledGrid>
            </StyledGrid>
            <StyledGrid styleConfig={{ root: UserPageStyles.userPageContainer() }}>
                <StyledGrid styleConfig={{ root: UserPageStyles.titleAndEditButtonContainer }}>
                    <Font styleConfig={{ root: FontsStyles.fontUserBoxTitle() }}>
                        {fm(messages.Subheading3)}
                    </Font>
                </StyledGrid>
                <StyledGrid styleConfig={{ root: UserPageStyles.userPageColumn() }}>
                    <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                        <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                            {fm(messages.guaranteeName)}
                        </Font>
                        <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                            {`${boardmembers && boardmembers[0].givenName} ${
                                boardmembers && boardmembers[0]?.surname
                            }`}
                        </Font>
                    </StyledGrid>
                    <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                        <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                            {fm(messages.guaranteeSSN)}
                        </Font>
                        <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                            {`${boardmembers && boardmembers[0].reference}`}
                        </Font>
                    </StyledGrid>
                    <StyledGrid styleConfig={{ root: UserPageStyles.userPageTextGroup() }}>
                        <StyledGrid
                            styleConfig={{ root: UserPageStyles.userPageTextButtonGroup() }}>
                            <Font styleConfig={{ root: FontsStyles.fontBoldedText() }}>
                                {fm(messages.guaranteePhone)}
                            </Font>
                            <StyledGrid
                                styleConfig={{ root: UserPageStyles.userPageButtonGroup() }}>
                                <StyledButton
                                    disabled={checkButtonDisabled("editPhoneNumber")}
                                    onClick={async () => {
                                        if (editPhoneNumber) {
                                            const isSaved = handleOnSaveClick(["phone"]);
                                            if (await isSaved) setEditPhoneNumber(false);
                                        } else {
                                            setEditPhoneNumber(true);
                                        }
                                    }}
                                    styleConfig={{
                                        root: ButtonStyles.greenButtonStyles({
                                            width: "35px",
                                            marginTop: "20px",
                                        }),
                                    }}>
                                    <Font
                                        styleConfig={{
                                            root: ButtonStyles.buttonFontStyles(),
                                        }}>
                                        <Icon
                                            icon={["fa", editPhoneNumber ? "save" : "pencil-alt"]}
                                        />{" "}
                                    </Font>
                                </StyledButton>

                                {editPhoneNumber ? (
                                    <StyledButton
                                        onClick={() => {
                                            setEditPhoneNumber(false);
                                            processReset();
                                        }}
                                        styleConfig={{
                                            root: ButtonStyles.grayButtonStyles({
                                                width: "35px",
                                                marginTop: "20px",
                                            }),
                                        }}>
                                        <Font
                                            styleConfig={{
                                                root: ButtonStyles.buttonFontStyles(),
                                            }}>
                                            X
                                        </Font>
                                    </StyledButton>
                                ) : null}
                            </StyledGrid>
                        </StyledGrid>
                        {editPhoneNumber ? (
                            <StyledGrid styleConfig={{ root: UserPageStyles.inputContainer() }}>
                                <TextField
                                    inputConfig={{
                                        name: "phone",
                                        value: form.data.phone,
                                        onFocus: () => {
                                            processFocus("phone");
                                        },
                                        onChange: (e) => {
                                            processChange({
                                                field: "phone",
                                                value: e.target.value,
                                            });
                                        },
                                        onBlur: () => {
                                            processBlur("phone");
                                        },
                                        onKeyDown: (e) => {
                                            if (e.key === "Enter") {
                                                processBlur("phone");
                                            }
                                        },
                                    }}
                                    styleConfig={{ root: UserPageStyles.textField() }}
                                />
                                <Error field="phone" />
                            </StyledGrid>
                        ) : (
                            <Font as="p" styleConfig={{ root: FontsStyles.fontContentText() }}>
                                {info?.phone}
                            </Font>
                        )}
                    </StyledGrid>
                </StyledGrid>
            </StyledGrid>
        </StyledGrid>
    );
}
