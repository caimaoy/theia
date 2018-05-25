/*
 * Copyright (C) 2018 Red Hat, Inc. and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import { injectable, inject } from 'inversify';
import WorkspaceClient, { IWorkspace, IRequestError, IRemoteAPI, IServer, IMachine } from '@eclipse-che/workspace-client';
import { EnvVariablesServer } from '@theia/core/lib/common/env-variables/env-variables-protocol';

const TYPE: string = "type";

export type TerminalApiEndPointProvider = () => Promise<string>;

@injectable()
export class Workspace {

    private api: IRemoteAPI;

    constructor(@inject(EnvVariablesServer) protected readonly envVariablesServer: EnvVariablesServer) {
    }

    public async getListMachines(): Promise<{ [attrName: string]: IMachine }> {
        const machineNames: { [attrName: string]: IMachine } = {};
        const workspaceId = await this.getWorkspaceId();
        const restClient = await this.getRemoteApi();
        if (!workspaceId || !restClient) {
            return machineNames;
        }
        return new Promise<{ [attrName: string]: IMachine }>((resolve, reject) => {
            restClient.getById<IWorkspace>(workspaceId)
                .then((workspace: IWorkspace) => {
                    if (workspace.runtime) {
                        resolve(workspace.runtime.machines);
                        return;
                    }
                    resolve({});
                })
                .catch((reason: IRequestError) => {
                    console.log("Failed to get workspace by ID: ", workspaceId, "Status code: ", reason.status);
                    reject(reason.message);
                });
        });
    }

    public async findTerminalServer(): Promise<IServer | undefined> {
        const machines = await this.getListMachines();

        // tslint:disable-next-line:forin
        for (const machineName in machines) {
            const servers = machines[machineName].servers;
            // tslint:disable-next-line:forin
            for (const serverName in servers) {
                const attrs = servers[serverName].attributes;
                if (attrs) {
                    for (const attrName in attrs) {
                        if (attrName === TYPE && attrs[attrName] === 'terminal') {
                            return servers[serverName];
                        }
                    }
                }
            }
        }
        return undefined;
    }

    public async getWorkspaceId(): Promise<string> {
        const variable = await this.envVariablesServer.getValue("CHE_WORKSPACE_ID");
        if (variable && variable.value) {
            return variable.value;
        }
        return '';
    }

    public async getWsMasterApiEndPoint(): Promise<string> {
        const variable = await this.envVariablesServer.getValue("CHE_API_EXTERNAL");
        if (variable && variable.value) {
            return variable.value;
        }
        return '';
    }

    private async getRemoteApi(): Promise<IRemoteAPI> {
        if (!this.api) {
            const baseUrl = await this.getWsMasterApiEndPoint();
            this.api = WorkspaceClient.getRestApi({
                baseUrl: baseUrl
            });
        }
        return this.api;
    }
}
