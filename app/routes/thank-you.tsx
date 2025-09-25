import React from "react";
import { LoaderFunction } from "react-router";
import { Container } from "@ui-components/index";

export const loader: LoaderFunction = async () => {
    console.log("thank you page loader");
    return null;
};

const thankYouPage: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col">
            <Container className="bg-white shadow-strong w-full max-w-xl mx-auto p-6 text-center">
                <h2 className="text-2xl font-bold text-base-content">Thank you!</h2>
                <p>Form sent! You can close the window.</p>
            </Container>
        </div>
    );
};
export default thankYouPage;
