import React from "react";
import { useActionData } from "react-router";
import { Container } from "@ui-components/index";
//import { T_SubmitActionData } from "~/types";

export const ResponsePage: React.FC = () => {
    /* const actionData = useActionData<T_SubmitActionData>(); */
    // TODO: Remove any
    const actionData = useActionData<any>();
    const { success, message, data } = actionData || {};
    const pageTitle = success ? "Submission Successful" : "An error occured!";
    const pageMessage = success
        ? "Thank you for your submission. You can now close this window."
        : message;
    const renderPayload = (data: unknown) => {
        if (Array.isArray(data)) {
            return (
                <ul>
                    {data.map((item, index) => (
                        <li key={index}>{renderPayload(item)}</li>
                    ))}
                </ul>
            );
        } else if (typeof data === "object" && data !== null) {
            return (
                <ul>
                    {Object.entries(data).map(([key, value]) => (
                        <li key={key}>
                            <strong>{key}:</strong> {renderPayload(value)}
                        </li>
                    ))}
                </ul>
            );
        } else {
            return <span>{String(data)}</span>;
        }
    };

    return (
        <Container className="bg-white shadow-strong w-full max-w-xl mx-auto p-6 text-center">
            {data ? (
                <>
                    <h2 className="text-2xl font-bold text-base-content">{pageTitle}</h2>
                    {success && <h3 className="text-xl text-base-content/60 my-5">Payload:</h3>}
                    {success && renderPayload(data)}
                    <p className="text-xl my-5">{pageMessage}</p>
                </>
            ) : (
                <h2 className="text-2xl font-bold text-base-content">Submitting data...</h2>
            )}
        </Container>
    );
};

export default ResponsePage;
