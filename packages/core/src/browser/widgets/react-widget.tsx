/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as ReactDOM from "react-dom";
import * as React from "react";
import { injectable } from "inversify";
import { DisposableCollection, Disposable, MaybeArray } from "../../common";
import { BaseWidget, Message } from "./widget";
import { ReactElement } from "react";

@injectable()
export abstract class ReactWidget extends BaseWidget {

    protected readonly onRender = new DisposableCollection();
    protected childContainer?: HTMLElement;
    protected scrollOptions = {
        suppressScrollX: true
    };

    constructor() {
        super();
        this.toDispose.push(Disposable.create(() => {
            if (this.childContainer) {
                ReactDOM.unmountComponentAtNode(this.childContainer);
            }
        }));
    }

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

        const widget = <React.Fragment>{child}</React.Fragment>;

        ReactDOM.render(widget, this.childContainer, () => this.onRender.dispose());
    }

    protected abstract render(): MaybeArray<ReactElement<any>>;

    protected createChildContainer(): HTMLElement {
        return document.createElement('div');
    }

}
