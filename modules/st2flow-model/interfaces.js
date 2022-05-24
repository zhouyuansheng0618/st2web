// Copyright 2021 The StackStorm Authors.
// Copyright 2020 Extreme Networks, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// @flow
import type { JpathKey, Range } from '@stackstorm/st2flow-yaml';

export type TransitionType = 'Success' | 'Error' | 'Complete';

export interface CanvasPoint {
    x: number;
    y: number
}

export interface TaskInterface {
    name: string;
    action: string;
    coords: CanvasPoint;

    size?: CanvasPoint;
    input?: Object;

    // Mistral only
    // workflow?: string;
    publish?: Array<Object>;

    // Orquesta only
    with?: ?{
        items: string,
        concurrency?: string,
    };
    retry?: ?{
        when: string,
        count?: string,
        delay?: string,
    };
    join?: ?string;
    delay?:?string;
    ref?: any;
}

export interface TaskRefInterface {
    name: string;
    workflow?: string;
}

export interface TransitionInterface {
    from: TaskRefInterface;
    to: Array<TaskRefInterface>;
    condition: ?string;

    // Mistral Only
    type?: TransitionType;

    // Orquesta Only
    publish?: Array<Object>;

    color?: string,
}

export interface TransitionRefInterface {
    from: TaskRefInterface;
    to: Array<TaskRefInterface>;
    condition: ?string;
}

export interface ModelInterface {
    +version: number;
    +description: string;
    +input: Array<Object | string>;
    +tasks: Array<TaskInterface>;
    +transitions: Array<TransitionInterface>;
    +lastTaskIndex: number;

    constructor(yaml: string): void;
    fromYAML(yaml: string): void;
    toYAML(): string;

    // These intentionally return void to prevent chaining
    // Consumers are responsible for cleaning up after themselves
    on(event: string, callback: Function): void;
    removeListener(event: string, callback: Function): void;

    addTask(opts: TaskInterface): void;
    updateTask(ref: TaskRefInterface, newData: $Shape<TaskInterface>): void;
    deleteTask(ref: TaskRefInterface): void;

    setTaskProperty(task: TaskInterface, path: JpathKey, value: any): void;
    deleteTaskProperty(task: TaskInterface, path: JpathKey): void;

    addTransition(opts: TransitionInterface): void;
    updateTransition(oldTransition: TransitionInterface, newData: $Shape<TransitionInterface>): void;
    deleteTransition(transition: TransitionInterface): void;

    setTransitionProperty(transition: TransitionInterface, path: JpathKey, value: any): void;
    deleteTransitionProperty(transition: TransitionInterface, path: JpathKey): void;

    getRangeForTask(task: TaskInterface): Range;

    undo(): void;
    redo(): void;
}

export interface EditorPoint {
    column: number;
    row: number;
}

export interface DeltaInterface {
    start: EditorPoint;
    end: EditorPoint;
    action: 'insert' | 'remove';
    lines: Array<string>;
}

export type AjvError = {
    dataPath: string,
    keyword: string,
    message: string,
    params: Object,
}

export type GenericError = Error | {
    message: string,
    mark?: EditorPoint,
}
