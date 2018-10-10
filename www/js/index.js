/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);

        $('.call-number button').click(app.onButtonClick)
    },

    onButtonClick: function() {
        var number = $('.call-number input').val().trim()
        if(!(/^\d{11}$/.test(number))) {
            alert('您输入的电话号码不合法!')
            return
        }

        window.plugins.CallNumber.callNumber(function(result) {
            app.displayCalllog()
        }, number, function (result) {
            alert("Error:" + result)
        })
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        app.displayCalllog();
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    displayInfo: function() {
        var deviceInfoElem = $('.device-info');
        for(var prop in device) {
            if(device.hasOwnProperty(prop)) {
                var propElem = $('<p><p>')                
                propElem.text(prop + ' : ' + device[prop]).appendTo(deviceInfoElem)
            }
        }
    },

    data: [
        {
            NUMBER: '159271252003',
            TYPE: '拨出',
            DURATION: '100s'
        }
    ],

    displayCalllog: function() {
        var _displayCalllog = function () {
            window.plugins.callLog.getCallLog([ ], function(data) {
                var tableStr = '<table>' + 
                               '<tr><td>电话号码</td><td class="call-number"></td></tr>' + 
                               '<tr><td>通话时间</td><td class="call-time"></td></tr>' + 
                               '<tr><td>通话时长</td><td class="call-duration"></td></tr>' +
                               '<tr><td>通话类型</td><td class="call-type"></td></tr>' + 
                               '<tr><td>姓名</td><td class="call-name"></td></tr>' + 
                               '</table>'
                var callLogList = $('<ul></ul>')
                var callTypes = ['呼入','呼出','未接通']
                data.forEach(function (callLog) {
                    var callLogItem = $('<li></li>')
                    var callLogTable = $(tableStr).appendTo(callLogItem)
                    callLogTable.find('.call-number').text(callLog.number)
                    callLogTable.find('.call-time').text((new Date(callLog.date)).toLocaleString())
                    callLogTable.find('.call-duration').text(callLog.duration + 's')
                    callLogTable.find('.call-type').text(callTypes[callLog.type - 1])
                    callLogTable.find('.call-name').text(callLog.name || '佚名')
                    callLogTable.appendTo(callLogList)
                })
                $('.calllog-list').empty().append(callLogList)
            }, function() {
                alert('获取通话记录失败！')
            })
        }

        window.plugins.callLog.hasReadPermission(_displayCalllog,
        // 若没有权限则请求
        function() {
            window.plugins.callLog.requestReadPermission(_displayCalllog, function() {
                alert('无法获得访问通话记录的权限！')
            })
        })
    }
};
