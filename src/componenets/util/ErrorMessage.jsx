import React from 'react';
import {Alert, Collapse} from "@mui/material";

const ErrorMessage = ({errorMessage}) => {

    return (
        <Collapse in={!!errorMessage}>
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                {errorMessage}
            </Alert>
        </Collapse>
    );
};

export default ErrorMessage;