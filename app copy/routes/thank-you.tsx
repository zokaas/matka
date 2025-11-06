import React, { useEffect } from "react";
import { ThankYou } from "apps/kyc/components";
import { useSession } from "~/context";

const thankYouRoute: React.FC = () => {
    const { destroySession } = useSession();

    useEffect(() => {
        destroySession();
    }, [destroySession]);
    return <ThankYou />;
};
export default thankYouRoute;
