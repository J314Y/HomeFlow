import React, { useState } from "react";
import { Button, Grid } from "@material-ui/core";

export default function SettingsButton(props) {
    return (
        <Grid item xs={12} align="center">
            <Button variant="contained" color="primary" onClick={props.change}>
                Settings
            </Button>
        </Grid>
    );
}
