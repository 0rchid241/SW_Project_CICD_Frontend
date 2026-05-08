import React from 'react';
import {Box, CircularProgress} from "@mui/material";

const LoadingCircle = () => {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
        </Box>
    );
};

export default LoadingCircle;