import React from "react";
import { Container } from "@ui-components/Container";
import { T_Error } from "./errorTypes";

export function Error({ title, children }: T_Error) {
    return (
        <div className="min-h-screen flex flex-col">
            <Container className="bg-white shadow-strong w-full max-w-xl mx-auto p-6 text-center">
                <h2 className="text-2xl font-base-content">{title}</h2>
                {children}
            </Container>
        </div>
    );
}

export default Error;
