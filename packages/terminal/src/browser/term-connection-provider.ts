/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { WebSocketConnectionProvider } from "@theia/core/lib/browser/messaging/ws-connection-provider";

export class TermConnectionProvider extends WebSocketConnectionProvider {

    protected createWebSocketUrl(path: string): string {
        return 'ws://172.17.0.1:32772/attach/';
    }
}
