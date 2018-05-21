/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { Task, TaskRunner } from '@theia/task/lib/common';
import { TaskManager } from '@theia/task/lib/node/task-manager';
import { CheTask } from './che-task';
import { ExecCreateClient, ExecAttachClientFactory } from './machine-exec-client';
import { CheTaskConfiguration } from '../common/task-protocol';

@injectable()
export class CheTaskRunner implements TaskRunner {

    @inject(ExecCreateClient)
    protected readonly execCreateClient: ExecCreateClient;

    @inject(ExecAttachClientFactory)
    protected readonly execAttachClientFactory: ExecAttachClientFactory;

    @inject(TaskManager)
    protected readonly taskManager: TaskManager;

    async run(task: CheTaskConfiguration, ctx?: string): Promise<Task> {
        const machineExec = {
            identifier: {
                machineName: task.target.machineName,
                workspaceId: task.target.workspaceId
            },
            cmd: ['sh', '-c', task.command],
            tty: false
        };

        try {
            const execId = await this.execCreateClient.create(machineExec);
            const execAttachClient = this.execAttachClientFactory.create(execId);
            execAttachClient.attach();
            console.log('Executed Che command: ' + execId);
        } catch (err) {
            console.error('Failed to execute Che command: ' + err);
        }

        return new CheTask(this.taskManager, task.label, ctx);
    }
}
