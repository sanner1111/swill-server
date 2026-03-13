const WebSocket = require('ws');
const dgram = require('dgram');

const wss = new WebSocket.Server({ port: 8080 });
const udpServer = dgram.createSocket('udp4');
let adminSocket = null;

wss.on('connection', (ws) => {
    console.log('Новое WebSocket подключение');
    ws.on('message', (message) => {
        const msgStr = message.toString();
        if (msgStr.startsWith('ADMIN')) {
            adminSocket = ws;
            console.log('Админ подключен');
        }
    });
});

udpServer.on('message', (msg, rinfo) => {
    if (adminSocket && adminSocket.readyState === WebSocket.OPEN) {
        adminSocket.send(msg);
    }
});

udpServer.bind(9090);
console.log('UDP сервер слушает порт 9090');
console.log('WebSocket сервер слушает порт 8080');
