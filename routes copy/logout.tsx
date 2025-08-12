import React from "react";
import { LoaderFunction } from "react-router";
import { Container } from "@ui-components/index";

export const loader: LoaderFunction = async () => {
    console.log("logout");
    return null;
};

const logoutPage: React.FC = () => {
    return (
        <Container className="bg-base-100 shadow-xl p-6">
            <h2 className="text-2xl font-bold text-base-content">SESSION EXPIRED</h2>
            <p>User will be redirected to source application</p>
        </Container>
    );
};
export default logoutPage;
