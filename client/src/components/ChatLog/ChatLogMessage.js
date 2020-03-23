import React from 'react';

import { ListItem, Typography } from '@material-ui/core';

export function ChatLogMessage(props) {
    return (
        <ListItem key={props.msg.id}>
            <Typography style={{fontWeight: 700}}>
                {props.msg.user.displayName}:&nbsp;
            </Typography>
            <Typography>
                {props.msg.message}
            </Typography>
        </ListItem>
    );
}