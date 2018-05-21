/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from 'inversify';
import { TaskRunner, TaskRunnerContribution } from '@theia/task/lib/common';
import { CheTaskRunner } from './che-task-runner';
import { CheTaskRunnerContribution } from './che-task-runner-contribution';
import { WebSocketConnectionProvider } from './messaging/ws-connection-provider';
import { ExecCreateClient, ExecAttachClientFactory } from './machine-exec-client';

export default new ContainerModule(bind => {
    bind(CheTaskRunner).toSelf().inSingletonScope();
    bind(TaskRunner).to(CheTaskRunner).inSingletonScope();
    bind(TaskRunnerContribution).to(CheTaskRunnerContribution).inSingletonScope();

    bind(WebSocketConnectionProvider).toSelf().inSingletonScope();
    bind(ExecCreateClient).toDynamicValue(ctx => {
        const provider = ctx.container.get(WebSocketConnectionProvider);
        return provider.createProxy<ExecCreateClient>('ws://172.17.0.1:32782/connect');
    }).inSingletonScope();
    bind(ExecAttachClientFactory).toSelf().inSingletonScope();
});
