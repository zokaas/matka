import { showModal } from "apps/kyc/components";
import { useState } from "react";
import { useActivityTracker } from "./useActivityTracker";
import { T_RefreshResult } from "./types";
import { useExternalRefreshListener } from "./useExternalRefreshListener";
import { useExpiryTimer } from "./useExpiryTimer";
import { T_SessionModalType } from "apps/kyc/components/SessionModal/types";
import { useNavigate } from "react-router";
import { useSession } from "~/context/SessionContext";

export const useSessionManager = () => {
    const navigate = useNavigate();
    const { session, refreshSession, updateSession } = useSession();

    // state: expiresAt in ms and refresh count
    const [expiresAt, setExpiresAt] = useState<number>(session.exp ?? 0);
    const [refreshCount, setRefreshCount] = useState<number>(session.sessionRefreshCount ?? 0);

    const { getLastActivity } = useActivityTracker();

    // handle a successful refresh result (update local state)
    const handleRefreshResult = (res: T_RefreshResult) => {
        console.log("[handleRefreshResult]", res);
        if (res) {
            setExpiresAt(res.exp);
            setRefreshCount(res.sessionRefreshCount);
            updateSession(res);
        }
    };

    // external event listener updates state as well
    useExternalRefreshListener(({ exp: newExp, sessionRefreshCount: newCount }) =>
        handleRefreshResult({ exp: newExp, sessionRefreshCount: newCount })
    );

    // function invoked by timer or modal to attempt refresh
    const attemptRefresh = async () => {
        const res = await refreshSession();
        if (!res) {
            navigate("/error");
            return null;
        }
        handleRefreshResult(res);
        return res;
    };

    const onShowModal = (type?: T_SessionModalType) => showModal(type);

    useExpiryTimer({
        expiresAtMs: expiresAt,
        getLastActivity,
        refreshCount,
        maxRefresh: session.maxSessionRefresh ?? 1,
        onAttemptRefresh: attemptRefresh,
        onShowModal,
    });

    return null;
};
