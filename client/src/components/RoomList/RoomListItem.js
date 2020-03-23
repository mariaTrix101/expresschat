import React from 'react';

import {
    Icon,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography
} from '@material-ui/core';

export function RoomListItem(props) {
    var nameProps = {};
    if (props.current)
        nameProps['fontWeight'] = 700;
    return (
        <ListItem button>
            <ListItemIcon>
                <Icon>{props.room.icon}</Icon>
            </ListItemIcon>
            <ListItemText>
                <Typography style={nameProps}>
                    {props.room.name}
                </Typography>
            </ListItemText>
        </ListItem>
    );
}