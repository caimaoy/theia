/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { TaskInfo, Task } from '@theia/task/lib/common';
import { TaskManager } from '@theia/task/lib/node/task-manager';

export class CheTask implements Task {

    id: number;
    context?: string | undefined;

    constructor(taskManager: TaskManager, protected readonly label: string, protected readonly execId: number, ctx?: string) {
        this.context = ctx;
        this.id = taskManager.register(this, this.context);
    }

    kill(): Promise<void> {
        throw new Error("Method not implemented.");
    }

    getRuntimeInfo(): TaskInfo {
        return {
            label: this.label,
            taskId: this.id,
            ctx: this.context,
            terminalId: this.execId
        };
    }
}
