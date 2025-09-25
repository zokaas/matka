import { useEffect } from "react";
import { useNavigate } from "react-router";

export const useSessionTTL = (ttl: number | undefined) => {
    const navigate = useNavigate();

    useEffect(() => {
        if (!ttl) return;
        const remainingTime = ttl * 1000;

        const timer = setTimeout(() => {
            fetch("/end-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            }).then((response) => {
                if (response.ok) {
                    navigate("/logout");
                } else {
                    console.error("Failed to end session");
                }
            });
        }, remainingTime);

        return () => clearTimeout(timer);
    }, [ttl, navigate]);
};
