import React, { Component } from 'react';

import {
    AppBar,
    Grid,
    Toolbar,
    Typography,
} from '@material-ui/core';
import { ChangeDisplayNameButton } from './ChangeDisplayNameButton';

export class PageAppBar extends Component {
    render() {
        return (
            <Grid item>
                <AppBar position="static">
                    <Toolbar>
                        <Typography variant="h6" style={{'flexGrow': '1'}}>
                            Express Chat
                        </Typography>
                        <ChangeDisplayNameButton displayName={this.props.displayName} onChangeName={this.props.onDisplayNameChanged} />
                        {/*
                            if (this.props.loggedIn)
                                <LogoutButton user={this.props.username} />
                            else
                                <LoginButton />
                        */}
                    </Toolbar>
                </AppBar>
            </Grid>
        );
    }
}