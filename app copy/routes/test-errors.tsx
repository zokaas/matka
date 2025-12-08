import React from "react";
import { LoaderFunction } from "react-router";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const errorType = url.searchParams.get("type");
    
    switch (errorType) {
        case "404":
            throw new Response("Test 404", { 
                status: 404, 
                statusText: "Not Found" 
            });
        case "401":
            throw new Response("Test 401", { 
                status: 401, 
                statusText: "Unauthorized" 
            });
        case "440":
            throw new Response("Test 440", { 
                status: 440, 
                statusText: "Session Expired" 
            });
        case "500":
            throw new Response("Test 500", { 
                status: 500, 
                statusText: "Internal Server Error" 
            });
        default:
            return { message: "Add ?type=404|401|440|500 to test errors" };
    }
};

export default function TestErrors() {
    return (
        <div style={{ padding: "2rem" }}>
            <h1>Error Testing Page</h1>
            <p>Click links to test different errors:</p>
            <ul>
                <li><a href="/test-errors?type=404">Test 404 Error</a></li>
                <li><a href="/test-errors?type=401">Test 401 Error</a></li>
                <li><a href="/test-errors?type=440">Test 440 Error</a></li>
                <li><a href="/test-errors?type=500">Test 500 Error</a></li>
            </ul>
        </div>
    );
}