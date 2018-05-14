/*
 * Copyright (C) 2017-2018 TypeFox and others.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 */

import * as React from "react";

export class StatusBarElements extends React.Component<StatusBarElements.Props> {
    render() {
        return <div key={"statusbar-elements-" + this.props.alignment + "-area"} className={"area " + this.props.alignment}>{this.props.entries}</div>;
    }
}

export namespace StatusBarElements {
    export interface Props {
        alignment: "left" | "right",
        entries: JSX.Element[]
    }
}
