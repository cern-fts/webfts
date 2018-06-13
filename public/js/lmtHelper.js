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


// For each file, localUpload will open up a WebSocket connection by dialing
// the address defined in sessionsStorage.lmtWebsocketEndpoint and maintain it
// in an an open state.
// Once all the transfer URLs have been received from the LMT proxy service,
// it calls runDataTransfer() to submit the transfer job to FTS.
function localUpload(files) {
    var endpointURLs = [];
    var fileData = [];
    var fileID;
    for (var i=0; i<files.length; i++){
        // Dial the WebSocket endpoint.
        var ws = new WebSocket(sessionStorage.lmtWebsocketEndpoint);
        ws.fileID = i;
        // Get the selected file's metadata.
        var file = files[i];
        fileData[i] = { name: file.name, size: file.size };
        console.log(fileData);

        var slice_start = 0;
        var slice_end = fileData.size;
        var finished = false;
        var success = false;
        var error_messages = [];
        var endpoint;

        // An event listener to be called when the WebSocket connection's
        // readyState changes to OPEN; this indicates that the LMT proxy
        // service is ready to receive the file's metadata.
        ws.onopen = function () {
            fileID = this.fileID;
            this.send(JSON.stringify(fileData[fileID]));
        }

        // An event listener to be called when a message is received from the
        // server.
        ws.onmessage = function (event) {
            fileID = this.fileID;
            // Parse controlMsg.
            var controlMsg = JSON.parse(event.data);
            console.log(event.data);

            switch (controlMsg.action) {
                case 'transfer':
                    endpoint = controlMsg.data;
                    endpointURLs.push(endpoint);
                    if (endpointURLs.length == files.length) {
                        // All the endpoint URLs have been received; submit the
                        // job to FTS
                        runTransferFromURLs(endpointURLs, 'rightEndpoint');
                    }
                    break;
                case 'ready':
                    // The LMT proxy service is ready to start the transfer.
                    this.send(files[fileID].slice(slice_start, fileData[fileID].size));
                    break;
                case 'finished':
                    // Transfer finished successfully.
                    success = true;
                    break;
                default:
            }
        }

        // An event listener to be called when the WebSocket connection's
        // readyState changes to CLOSED.
        ws.onclose = function () {
            if (success) {
                // A { action: 'finished' } message has been recieved for this
                // transfer.
                return;
            }

            if (error_messages.length == 0) {
                error_messages[0] = { error: 'Unknown upload error' };
            }
            console.log(error_messages);
        }

    }
}
