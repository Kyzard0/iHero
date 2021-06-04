import React from 'react';
import io from "socket.io-client";

export const socket = io.connect('https://zrp-challenge-socket.herokuapp.com');
export const SocketContext = React.createContext();
