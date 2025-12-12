import { useState } from "react";
import { css } from "@styled-system/css";

import { Container, Font, Tooltip, FileInput, Icon } from "@opr-finance/styled-components";
import { componentStyles, pageStyles } from "@opr-finance/themes/sweden-foretagslan-application";
import { handleAttachment } from "@opr-finance/features/file-upload-handler";

import { T_AttachmentBlockProps } from "./attachmentBlock.types";
import { T_AttachmentFileObject } from "../../types";

export const AttachmentBlock = (props: T_AttachmentBlockProps) => {
    const { buttonStyles, attachmentBlockStyles, tooltipStyles } = componentStyles;
    const { applicationPageStyles } = pageStyles;
    const [uploadedFilesCount, setUploadedFilesCount] = useState<number>(0);
    const [invalidFiles, setInvalidFiles] = useState<File[]>([]);
    const [attachmentError, setAttachmentError] = useState<string>("");

    const { fields, handleFocus, handleBlur, getErrorMessage } = props;

    const fileSettings = {
        size: 1048576, //1Mb
        maxCount: 5,
    };

    const handleFileUpload = (e: any) => {
        let uploadedFiles;
        if (e.length > fileSettings.maxCount) {
            uploadedFiles = e.slice(0, 5);
            setAttachmentError("Cannot upload more than 5 attachments!");
        } else {
            uploadedFiles = e;
        }

        const validFiles = uploadedFiles.filter((file: File) => file.size <= fileSettings.size);
        const inValidFiles = uploadedFiles.filter((file: File) => file.size > fileSettings.size);
        setInvalidFiles((prevState) => [...prevState, ...inValidFiles]);

        const fileObject: T_AttachmentFileObject[] = validFiles.map((file: File) => {
            const fileObj = handleAttachment(file);
            return fileObj;
        });
        const data =
            fields.attachments && fields.attachments.length > 0
                ? [...fields.attachments, ...fileObject]
                : fileObject;
        props.handleFieldChange({ name: "attachments", value: data });
        setUploadedFilesCount(uploadedFilesCount + e.length);
    };

    const handleFileRemove = (fileName: string) => {
        const newList = fields.attachments?.filter((file) => file.name !== fileName) || [];
        props.handleFieldChange({ name: "attachments", value: newList });
        setUploadedFilesCount(uploadedFilesCount - 1);
    };

    return (
        <Container id={props.formId} styles={pageStyles.applicationPageStyles.formBlock}>
            <Font styles={pageStyles.applicationPageStyles.blockHeading}>Ladda upp dokument</Font>
            <Font styles={applicationPageStyles.infoBox}>
                Här kan du ladda upp kompletterande dokument, som ditt bokslut eller en aktuell
                balans- och resultatrapport.
            </Font>
            <Container styles={attachmentBlockStyles.tooltipContainer}>
                <Font
                    styles={
                        attachmentBlockStyles.fileText
                    }>{`Filuppladdning  (${uploadedFilesCount}/5)`}</Font>{" "}
                <Tooltip delayClose={3000} styles={tooltipStyles}>
                    Välj dokument på din dator och ladda upp dessa. Formatet måste vara .pdf .png
                    eller.jpg
                </Tooltip>
            </Container>
            <br />
            <FileInput
                config={{
                    multiple: true,
                    accept: ".pdf,.jpg,.jpeg,.png",
                    onChange: (e: any) => handleFileUpload(Array.from(e.currentTarget.files || [])),
                    onBlur: (e: any) =>
                        handleBlur({
                            name: "attachments",
                            value: Array.from(e.currentTarget.files || []),
                        }),
                    onFocus: () => handleFocus("attachments"),
                }}
                disabled={uploadedFilesCount === 5}
                styles={{
                    buttonStyles: buttonStyles.buttonStyles,
                    inputStyles: { display: "none" },
                }}>
                Ladda upp
            </FileInput>
            <Container styles={attachmentBlockStyles.attachmentWrapper}>
                {props.fields.attachments?.map((file) => (
                    <Container key={file.name} styles={attachmentBlockStyles.filesContainer}>
                        <Icon
                            style={css(attachmentBlockStyles.trashIcon)()}
                            size="1x"
                            icon={["fas", "trash-alt"]}
                            onClick={() => handleFileRemove(file.name)}
                        />
                        <Font styles={attachmentBlockStyles.fileText}>{file.name}</Font>
                    </Container>
                ))}
                {invalidFiles.map((file) => (
                    <Font
                        key={file.name}
                        styles={
                            attachmentBlockStyles.errorText
                        }>{`File ${file.name} too big`}</Font>
                ))}
                {attachmentError && (
                    <Font styles={attachmentBlockStyles.errorText}>
                        {getErrorMessage("attachments")}
                    </Font>
                )}
            </Container>
        </Container>
    );
};
