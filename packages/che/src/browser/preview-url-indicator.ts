/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import { CommandContribution, CommandRegistry, Command } from '@theia/core';
import { FrontendApplicationContribution, StatusBar, StatusBarEntry, StatusBarAlignment } from '@theia/core/lib/browser';
import { PreviewURLQuickOpen } from './preview-url-quick-open';

@injectable()
export class PreviewUrlIndicator implements FrontendApplicationContribution, CommandContribution {

    @inject(StatusBar)
    protected readonly statusBar: StatusBar;

    @inject(PreviewURLQuickOpen)
    protected readonly previewURLQuickOpen: PreviewURLQuickOpen;

    onStart(): void {
        const element: StatusBarEntry = {
            text: 'Previews',
            alignment: StatusBarAlignment.LEFT,
            tooltip: 'Go to preview URL',
            command: 'che.previewurl.go'
        };
        this.statusBar.setElement('che-preview-url', element);
    }

    registerCommands(commands: CommandRegistry): void {
        const command: Command = {
            id: 'che.previewurl.go',
            label: 'Go to preview URL...'
        };
        commands.registerCommand(command, {
            execute: () => this.previewURLQuickOpen.open()
        });
    }
}
