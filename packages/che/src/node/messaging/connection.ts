/*
 * Copyright (C) 2017 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { MessageConnection, Logger } from 'vscode-jsonrpc';
import { createWebSocketConnection, IWebSocket } from 'vscode-ws-jsonrpc';
import { ConsoleLogger } from 'vscode-ws-jsonrpc';
import * as ReconnectingWebSocket from 'reconnecting-websocket';

export function listen(options: {
    webSocket: ReconnectingWebSocket;
    logger?: Logger;
    onConnection: (connection: MessageConnection) => void;
}) {
    const { webSocket, onConnection } = options;
    const logger = options.logger || new ConsoleLogger();
    webSocket.addEventListener('open', () => {
        const socket = toSocket(webSocket);
        const connection = createWebSocketConnection(socket, logger);
        onConnection(connection);
    });
}

export function toSocket(webSocket: ReconnectingWebSocket): IWebSocket {
    return {
        send: content => webSocket.send(content),
        onMessage: cb => {
            webSocket.addEventListener('message', event => cb(event.data));
        },
        onError: cb => webSocket.onerror = event => {
            if ('message' in event) {
                // tslint:disable-next-line:no-any
                cb((event as any).message);
            }
        },
        onClose: cb => webSocket.onclose = event => cb(event.code, event.reason),
        dispose: () => webSocket.close()
    };
}
