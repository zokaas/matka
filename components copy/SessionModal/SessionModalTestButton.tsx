import React from "react";
import { Button } from "@ui/button";
import { showSessionModal } from "./SessionModalManager";

export const SessionModalTestButton: React.FC = () => {
    const testRefreshModal = () => {
        showSessionModal({ type: "refresh", remainingMs: 60000 });
    };

    const testExpiredModal = () => {
        showSessionModal({ type: "expired", remainingMs: 5000 });
    };

    return (
        <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
            <Button onClick={testRefreshModal} label="Test Refresh Modal" type={"reset"} />
            <Button onClick={testExpiredModal} label="Test Expired Modal" type={"reset"} />
        </div>
    );
};