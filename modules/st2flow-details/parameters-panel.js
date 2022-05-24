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

//@flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { PropTypes } from 'prop-types';

import Parameter from './parameter';
import ParameterEditor from './parameter-editor';
import Button from '@stackstorm/module-forms/button.component';

import { Panel } from './layout';

function sortParameters(params: {[string]: { position?: number }}): {[string]: {}} {
  const keys = Object.keys(params);
  keys.sort((a, b) => {
    const aPos = params[a].position;
    const bPos = params[b].position;

    if(aPos == null && bPos == null) {
      return 0;
    }
    if(aPos == null) {
      return 1;
    }
    if(bPos == null) {
      return -1;
    }
    return aPos - bPos;
  });
  const retVal = {};
  keys.forEach(key => {
    retVal[key] = params[key];
  });
  return retVal;
}

@connect(
  ({ flow: { meta }}) => ({ meta }),
  (dispatch) => ({
    setMeta: (field, value) => dispatch({
      type: 'META_ISSUE_COMMAND',
      command: 'set',
      args: [ field, value ],
    }),
  })
)
export default class Parameters extends Component<{
  meta: Object,
  setMeta: Function,
}, {
  edit: bool,
}> {
  static propTypes = {
    meta: PropTypes.object,
    setMeta: PropTypes.func,
  }

  state = {
    edit: false,
  }

  handleAdd({ name, ...properties }: { name: string }) {
    const parameters = this.props.meta.parameters;
    this.props.setMeta('parameters', sortParameters({ ...parameters, [name]: properties}));
    this.setState({ edit: false });
  }

  handleChange(oldName: string, { name, ...properties }: { name: string }) {
    const { ...parameters } = this.props.meta.parameters;
    if (oldName !== name) {
      delete parameters[oldName];
    }
    this.props.setMeta('parameters', sortParameters({ ...parameters, [name]: properties}));
    this.setState({ edit: false });
  }

  handleDelete(name: string) {
    const { ...parameters } = this.props.meta.parameters;
    delete parameters[name];
    this.props.setMeta('parameters', parameters);
  }

  render() {
    const { meta } = this.props;
    const { edit } = this.state;

    return (
      <Panel>
        {
          edit === false && meta.parameters && meta.parameters.__meta.keys.map(name => (
            <Parameter
              key={name}
              name={name}
              parameter={meta.parameters[name]}
              onEdit={parameter => this.setState({ edit: name })}
              onDelete={() => this.handleDelete(name)}
            />
          ))
        }
        {
          edit === false && <Button value="Add parameter" onClick={() => this.setState({ edit: true })} />
        }
        {
          edit === true &&
            //$FlowFixMe
            <ParameterEditor onChange={parameter => this.handleAdd(parameter)} onCancel={() => this.setState({ edit: false })} />
        }
        {
          typeof edit === 'string' && (
            <ParameterEditor
              parameter={{ ...meta.parameters[edit], name: edit }}
              onChange={parameter => this.handleChange(edit, parameter)}
              onCancel={() => this.setState({ edit: false })}
            />
          )
        }
      </Panel>
    );
  }
}
