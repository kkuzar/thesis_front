import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import * as React from "react";


function Copyright(props: any) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright © '}
            <Link color="inherit" href="https://thesis.kuzar.fi/">
                thesis.kuzar.fi
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

export default Copyright