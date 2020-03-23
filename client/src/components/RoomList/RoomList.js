import React from 'react';

import {
    Grid,
    List,
    Typography,
} from '@material-ui/core';
import { RoomListItem } from './RoomListItem';


export function RoomList(props) {
    const roomElements = props.rooms.map(room => <RoomListItem key={room.id} room={room} />);
    return (
        <Grid container direction="column" justify="flex-start" alignItems="stretch" wrap="nowrap">
            <Grid item>
                <Typography align="center" variant="h4">
                    Room List
                </Typography>
            </Grid>
            <Grid item className='FullHeight'>
                <List>
                    {roomElements}
                </List>
            </Grid>
        </Grid>
    );
}
