import { RT_API } from './const';

import openSocket from 'socket.io-client';

const socket = openSocket(RT_API);

export default socket;
