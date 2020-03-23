import React from 'react';
import './App.css';

import { PageAppBar }  from './components/AppBar/PageAppBar';
import { PageContent } from './components/PageContent';

import { RoomList } from './components/RoomList/RoomList';
import { ChatLog } from './components/ChatLog/ChatLog';
import { UserList } from './components/UserList/UserList';

import { CssBaseline, Grid } from '@material-ui/core';
import { PaperBase } from './components/PaperBase';

import io from 'socket.io-client';
import SocketEvents from './socketEvents';

class App extends React.Component {
    static socket;
    constructor() {
        super();
        this.state = {
            profile: {
                id: -1,
                displayName: '',
                room: -1,
            },
            rooms: [],
            messages: [],
            users: [],
        };
        this.onDisplayNameChanged = this.onDisplayNameChanged.bind(this);
        this.onSendMessage = this.onSendMessage.bind(this);
    }

    componentDidMount() {
        App.socket = io('localhost:4000');
        App.socket.on(SocketEvents.Connection, () => {
            App.socket.on(SocketEvents.GetProfileResponse, (profile) => {
                this.setState({
                    profile: {
                        id: profile.id,
                        displayName: profile.displayName,
                        room: profile.currentRoom.id
                    }
                });
            });
            App.socket.on(SocketEvents.GetRoomsResponse, (rooms) => {
                this.setState({
                    rooms: rooms
                });
            });
            App.socket.on(SocketEvents.RoomListData, (data) => {
                this.setState((state) => {
                    return {
                        ...state,
                        profile: {
                            id: state.id,
                            displayName: state.displayName,
                            room: data.room.id
                        },
                        users: data.users,
                        messages: []
                    }
                });
            });
            App.socket.on(SocketEvents.UserDisplayNameChanged, (user) => {
                this.setState((state) => {
                    return {
                        ...state,
                        users: state.users.map((item) => {
                            if (item.id === user.id)
                                item.displayName = user.displayName;
                            return item;
                        })
                    }
                });
            });
            App.socket.on(SocketEvents.UserJoinedRoom, (user) => {
                if (user.id === this.state.profile.id) return;
                this.setState((state) => {
                    return {
                        ...state,
                        users: state.users.concat(user)
                    }
                });
            })
            App.socket.on(SocketEvents.UserLeftRoom, (user) => {
                this.setState((state) => {
                    return {
                        ...state,
                        users: state.users.filter((item, i) => {
                            return user.id !== item.id;
                        })
                    };
                });
            })
            App.socket.on(SocketEvents.RoomMessage, (msg) => {
                this.setState((state) => {
                    return {
                        ...state,
                        messages: [
                            ...state.messages,
                            msg
                        ]
                    }
                });
            })
            App.socket.emit(SocketEvents.GetProfileRequest, {});
            App.socket.emit(SocketEvents.GetRoomsRequest, {});
        });
    }

    onDisplayNameChanged(newName) {
        App.socket.emit(SocketEvents.SetDisplayName, newName);
        this.setState((state) => {
            return {
                ...state,
                profile: {
                    id: state.profile.id,
                    displayName: newName,
                    room: state.profile.room
                }
            };
        });
    }

    onSendMessage(newMessage) {
        // send newMessage with socket io
        App.socket.emit(SocketEvents.SendMessage, newMessage);
    }

    render() {
        return (
            <div className='App'>
                <CssBaseline />
                <Grid container direction="column" justify="flex-start" alignItems="stretch" wrap="nowrap" style={{'height': '100%'}}>
                    <PageAppBar displayName={this.state.profile.displayName} onDisplayNameChanged={this.onDisplayNameChanged} />
                    <PageContent>
                        {/* These items are a part of a nested <Grid container...> in PageContent */}
                        <PaperBase size={3}>
                            <RoomList rooms={this.state.rooms} />
                        </PaperBase>
                        <PaperBase size={6}>
                            <ChatLog messages={this.state.messages} onSendMessage={this.onSendMessage} />
                        </PaperBase>
                        <PaperBase size={3}>
                            <UserList users={this.state.users} />
                        </PaperBase>
                    </PageContent>
                </Grid>
            </div>
        );
    }
}

export default App;
