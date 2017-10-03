/*
 * Copyright (c) CERN 2017
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function AttachProxy(file) {
  var ws = new WebSocket(sessionStorage.lmtProxyEndpoint);
  var delegationID = Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  var filedata = { name: file.name, size: file.size, delegationID: delegationID };
  console.log(filedata);

  var slice_start = 0;
  var slice_end = filedata.size;
  var finished = false;
  var success = false;
  var error_messages = [];
  var endpoint;

  ws.onopen = function () {
    ws.send(JSON.stringify(filedata));
  }

  ws.onmessage = function (event) {
    // Parse controlMsg.
    var controlMsg = JSON.parse(event.data);
    console.log(event.data);

    switch (controlMsg.action) {
      case 'transfer':
        endpoint = controlMsg.data;
        break;
      case 'ready':
        // LMT proxy is ready to start the transfer.
        ws.send(file.slice(slice_start, slice_end));
        break;
      case 'finished':
        // Transfer finished successfully.
        success = true;
        break;
      default:
    }
  }

  ws.onclose = function () {
    if (success) {
      return;
    }

    if (error_messages.length == 0) {
      error_messages[0] = { error: 'Unknown upload error' };
    }
    console.log(error_messages);
  }
}