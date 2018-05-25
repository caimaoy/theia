/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { ContainerModule } from 'inversify';
import { FrontendApplicationContribution } from '@theia/core/lib/browser';
import { TaskContribution } from '@theia/task/lib/common';
import { CommandContribution } from '@theia/core/lib/common/command';
import { CheTaskContribution } from './che-task-contribution';
import { CheTaskProvider } from './che-task-provider';
import { CheTaskResolver } from './che-task-resolver';
import { Workspace } from './che-workspace-client';
import { PreviewUrlIndicator } from './preview-url-indicator';
import { PreviewURLQuickOpen } from './preview-url-quick-open';

export default new ContainerModule(bind => {
    bind(CheTaskProvider).toSelf().inSingletonScope();
    bind(CheTaskResolver).toSelf().inSingletonScope();
    bind(TaskContribution).to(CheTaskContribution).inSingletonScope();

    bind(FrontendApplicationContribution).to(PreviewUrlIndicator).inSingletonScope();
    bind(CommandContribution).to(PreviewUrlIndicator).inSingletonScope();
    bind(PreviewURLQuickOpen).toSelf().inSingletonScope();

    bind(Workspace).toSelf().inSingletonScope();
});
