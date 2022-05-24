// Copyright 2021 The StackStorm Authors.
// Copyright 2019 Extreme Networks, Inc.
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
import React from 'react';
import qs from 'qs';
import api from '@stackstorm/module-api';
import router from '@stackstorm/module-router/methods';
export default class Bridge extends React.Component {
  
  constructor(props) {
    super(props);
  }


  componentDidMount () {
    api.setServer(server,true);
    const paramsStr = window.location.href.split('?')[1];
    
    const paramsJson = qs.parse(paramsStr);
    const tokenStr = paramsJson.token;
    const { server } = api.readPersistent();
    localStorage.setItem('st2Session', JSON.stringify({
      server: server,
      token: JSON.parse(tokenStr),
    }));
    document.cookie=`st2-auth-token=${paramsStr.split('=')[1]}`;
    setTimeout(() => {
      this.toIndex();
    }, 2000);
    
  }


  toIndex () {
    router.push({ pathname: '/history' });
  }

  render() {
    return (
      <div>
        Loading
      </div>
    );
  }
}
