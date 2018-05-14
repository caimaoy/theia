/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ReactDOM from "react-dom";
import { injectable } from "inversify";
import { DisposableCollection } from "../../common";
import { BaseWidget, Message } from "./widget";
import { ReactElement } from "react";

@injectable()
export class ReactWidget extends BaseWidget {

    protected readonly onRender = new DisposableCollection();
    protected childContainer?: HTMLElement;
    protected scrollOptions = {
        suppressScrollX: true
    };

    protected onUpdateRequest(msg: Message): void {
        super.onUpdateRequest(msg);
        const child = this.render();
        if (!this.childContainer) {
            // if we are adding scrolling, we need to wrap the contents in its own div, to not conflict with the virtual dom algo.
            if (this.scrollOptions) {
                this.childContainer = this.createChildContainer();
                this.node.appendChild(this.childContainer);
            } else {
                this.childContainer = this.node;
            }
        }
        ReactDOM.render(child, this.childContainer);
        this.onRender.dispose();
    }

    protected render(): ReactElement<any> {
        return {
            key: null,
            props: undefined,
            type: "span"
        };
    }

    protected createChildContainer(): HTMLElement {
        return document.createElement('div');
    }

}
