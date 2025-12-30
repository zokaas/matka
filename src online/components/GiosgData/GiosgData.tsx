import React from "react";

export function GiosgData(props) {
    return (
        <div id="giosgLoggedInUserDataDiv">
            <input
                type="hidden"
                value={props.customerId}
                name="customerIdForGiosg"
                id="customerIdForGiosg"
            />
            <input
                type="hidden"
                value={props.customerName}
                name="customerNameForGiosg"
                id="customerNameForGiosg"
            />
        </div>
    );
}
