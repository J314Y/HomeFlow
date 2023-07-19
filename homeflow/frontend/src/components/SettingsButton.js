import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";

function SettingsButton({ change }) {
    return (
        <Grid item xs={12} align="center">
            <Button variant="contained" color="primary" onClick={() => change()}>
                Settings
            </Button>
        </Grid>
    );
}

export default SettingsButton;