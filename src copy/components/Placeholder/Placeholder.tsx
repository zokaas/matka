import React from "react";

type PlaceholderProps = {
    children: React.ReactNode;
};

const Placeholder = ({ children }: PlaceholderProps) => {
    return <h1>{children}</h1>;
};

export default Placeholder;
