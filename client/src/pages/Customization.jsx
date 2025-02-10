import React, { useContext, useEffect } from "react";
import { Navigate } from "react-router-dom"; // Import Navigate component
import { UserContext } from "@/App";
import CustomizationCanvas from "../components/CustomizationTools/CustomizationCanvas";

const Customization = () => {
    const { user } = useContext(UserContext);

    // If the user is not authenticated, redirect them to the login page
    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <div>
            <CustomizationCanvas />
        </div>
    );
};

export default Customization;
