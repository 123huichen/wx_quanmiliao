//获取应用实例
const app = getApp();
 
 //socket
var mapdata = {};
var socketOpen = false;
function talkSocket(uid,token){
    //建立连接
    wx.connectSocket({
        //url: "wss://2.baiwujie.com/wsspro/", //正式
        url: "wss://2.baiwujie.com/wss/", //测试
    })
    //监听WebSocket连接打开事件
    wx.onSocketOpen(function (res) {
        socketOpen = true
        console.log('WebSocket连接已打开！')
        heart();
        login(uid, token);
    })
}

//心跳定时器
function heart() {
    setTimeout(function () {
        if (socketOpen) {
            wx.sendSocketMessage({
                data: '0',
            })
            heart();
        }

    }, 10000);
}

//登录聊天服务
function login(uid, token) {
    console.log('登录聊天服务');
    mapdata = {
        "uid": uid,
        "token": token,
    };
    var msgData = {
        "uri": "Common.login",
        "msg_id": 1,
        "data": mapdata,
    }
    var data = JSON.stringify(msgData)
    wx.sendSocketMessage({
        data: data,
    })
}
 
//直播间心跳定时器
function Liveheart(uid, token, heartbeatId,){
    // if (heart){
    setTimeout(function () {
        var mapdata = {
            'uid': uid,
            'token': token,
            'id': heartbeatId,
        };
        var msgData = {
            "uri": "Connect.heart",
            "msg_id": 1,
            "data": mapdata,
        }
        var data = JSON.stringify(msgData)
        console.log('直播间心跳发送' + data)
        wx.sendSocketMessage({
            data: data,
        })
        Liveheart(uid, token, heartbeatId);
    }, 5000);
}




//添加数组对象 判断对话来源
function pushdArray(arr, myid) {
    var layoutright = { layout: 'right' };
    var layoutleft = { layout: 'left' };
    var typedata = { type: 'message.text'};
    if (arr.length){
        for (var i = 0; i < arr.length; i++) {
            arr[i].time = formatDateTime(arr[i].time);
            if (arr[i].from_info.id == myid) {
                //增加对话属性layout right为自己
                for (var key in layoutright) {
                    arr[i][key] = layoutright[key];
                }
                //增加type类型'message.text'
                if (arr[i].type == '' || arr[i].type == null || arr[i].type == undefined){
                    for (var key in typedata) {
                        arr[i][key] = typedata[key];
                    }
                }
                arr[i].id = 'abc' + arr[i].id;

            } else {
                //增加对话属性layout left为自己
                for (var key in layoutleft) {
                    arr[i][key] = layoutleft[key];
                }
                //增加type类型'message.text'
                if (arr[i].type == '' || arr[i].type == null || arr[i].type == undefined) {
                    for (var key in typedata) {
                        arr[i][key] = typedata[key];
                    }
                }
                arr[i].id = 'abc' + arr[i].id;

            }
        }
    } else {
        arr.time = formatDateTime(arr.time);
        if (arr.from_info.id == myid) {
            for (var key in layoutright) {
                arr[key] = layoutright[key];
            }
            //增加type类型'message.text'
            if (arr.type == '' || arr.type == null || arr.type == undefined) {
                for (var key in typedata) {
                    arr[key] = typedata[key];
                }
            }
            arr.id = 'abc' + arr.id;
        } else {
            for (var key in layoutleft) {
                arr[key] = layoutleft[key];
            }
            //增加type类型'message.text'
            if (arr.type == '' || arr.type == null || arr.type == undefined) {
                for (var key in typedata) {
                    arr[key] = typedata[key];
                }
            }
            arr.id = 'abc' + arr.id;
        }
    }
    
    return arr;
}


//时间戳转yyyy - mm - dd
function formatDateTime(timeStamp) {
    var date = new Date();
    date.setTime(timeStamp * 1000);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
};


//礼物动画
function createAnimation(){
    var animation = wx.createAnimation({
        duration: 1000,
        timingFunction: 'ease',
    })
    
    this.animation = animation;
    
}



module.exports = {
    talkSocket: talkSocket,
    pushdArray: pushdArray,
    Liveheart: Liveheart
}