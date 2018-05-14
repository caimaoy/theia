/*
 * Copyright (C) 2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";
import { StatusBarElements } from "./status-bar-elements";

export class StatusBarView extends React.Component<StatusBarView.Props> {

    render() {
        return [this.props.leftElements, this.props.rightElements];
    }
}

export namespace StatusBarView {
    export interface Props {
        leftElements: React.ReactElement<StatusBarElements>;
        rightElements: React.ReactElement<StatusBarElements>;
    }
}
