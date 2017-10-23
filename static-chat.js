//
//Copyright (c) 2016, Skedans Systems, Inc.
//All rights reserved.
//
//Redistribution and use in source and binary forms, with or without
//modification, are permitted provided that the following conditions are met:
//
//    * Redistributions of source code must retain the above copyright notice,
//      this list of conditions and the following disclaimer.
//    * Redistributions in binary form must reproduce the above copyright
//      notice, this list of conditions and the following disclaimer in the
//      documentation and/or other materials provided with the distribution.
//
//THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
//AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
//IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
//ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
//LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
//CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
//SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
//INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
//CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
//ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
//POSSIBILITY OF SUCH DAMAGE.
//

var FRONT = "cam0";
var BACK = "cam1";
var videoSources = [];
//var fCam = true;
var occupantIds = [];
var addedMembers = [];
var myVideo = new Object();
var cameraOn = false;
//var myStream;
//var myVideo;
//var myId;
var fsVideo;


function callEverybodyElse(roomName, occupants) {
    
    easyrtc.setRoomOccupantListener(null);
    for(var easyrtcid in occupants){
            occupantIds.push(easyrtcid);
    }
        var keys = easyrtc.getLocalMediaIds();

function establishConnections(position) {
    function acceptedCB (accepted, easyrtcid) {
        //alert("acceptedCB" + easyrtcid + "calling " + occupantIds[position]);
        if(position+1 < occupantIds.length)
            establishConnections(position+1);
    };

    function callSuccess() {
        
    };
    function callFailure(errorCode, errorText) {
        alert("callFailure:" + errorText);
        if(position+1 < occupantIds.length)
            establishConnections(position+1);
    };
        
        setTimeout(() => {
            easyrtc.call(occupantIds[position], callSuccess, callFailure, acceptedCB, keys);
        }, 1000);
}
if(occupantIds.length > 0)
    establishConnections(0);
    /*function acceptedCB (accepted, easyrtcid) {
        alert("acceptedCB");
    };

    function callSuccess() {
        
    };
    function callFailure(errorCode, errorText) {
        alert("callFailure:" + errorText);
    };
        
        var keys = easyrtc.getLocalMediaIds();

    for(var easyrtcid in occupants){
        //alert("calling " + easyrtcid);
        //setTimeout(() => {
            alert("calling " + easyrtcid);
            occupantIds.push(easyrtcid);
            easyrtc.call(easyrtcid, callSuccess, callFailure, acceptedCB, keys);
        //}, 500);
    }*/

   /* function establishConnection(position) {
        
        function acceptedCB (accepted, easyrtcid) {
            alert("acceptedCB");};

        function callSuccess() {
            alert("callSuccess");
            if(position+1 < occupantIds.length) {
                establishConnection(position+1);
            }
        }
        function callFailure(errorCode, errorText) {
            alert("callFailure" + errorText);
            if(position+1 < occupantIds.length) {
                establishConnection(position+1);
            }
        }

        var keys = easyrtc.getLocalMediaIds();
        easyrtc.call(occupantIds[position], callSuccess, callFailure, acceptedCB, keys);

    }

    if(occupantIds.length > 0)
        establishConnection(0);*/
}

function swtichCamera (e)
{
    if(videoSources.length < 2) 
    return alert("您只有一个摄像头！");

    easyrtc.closeLocalStream(myVideo.streamName);

    if(myVideo.streamName == FRONT) {
        myVideo.streamName = BACK;
        e.classList.add("icon-selected");

    }
    else{
        myVideo.streamName = FRONT;
        e.classList.remove("icon-selected");
    }

    setTimeout(() => {
                    startCamera(videoSources[myVideo.streamName == FRONT ? 0 : 1],myVideo.streamName, function(){
                        /*function addStreamToCall(i){
                            alert("addstreamto " + addedMembers[i].id);
                        easyrtc.addStreamToCall(addedMembers[i].id, myVideo.streamName, function(easyrtcid, streamName)
                        {
                            alert("other party " + easyrtcid + " acknowledges receiving " + streamName);
                            addStreamToCall(i++);
                        });
                        };
                        addStreamToCall(0);*/

                        function addStreamToCall(i){
                            if(i < addedMembers.length) {
                            //alert(addedMembers.length + " " + i + " addstreamto " + addedMembers[i].id);
                            easyrtc.addStreamToCall(addedMembers[i].id, myVideo.streamName, function(easyrtcid, streamName)
                            {
                            //alert("other party " + easyrtcid + " acknowledges receiving " + streamName);
                            setTimeout(() => {
                            addStreamToCall(i+1);
                            });
                            }, 2000);
                            }
                        };

                        addStreamToCall(0);

                        /*for(var i = 0;i < addedMembers.length;i++){
                            setTimeout(() => {
                            alert("addstreamto " + addedMembers[i].id);
                            easyrtc.addStreamToCall(addedMembers[i].id, myVideo.streamName, function(easyrtcid, streamName){
                                alert("other party " + easyrtcid + " acknowledges receiving " + streamName);
                            }); 
                            }, 1000);
                        }*/
                    
        });
                }, 2000);
    
}

function startOrStopCamera(e) {
    if(cameraOn) {
    cameraOn = false;
    e.classList.add("icon-selected");
    //easyrtc.closeLocalStream(fCam ? "mycam0" : "mycam1");
    
    } else {
        cameraOn = true;
        e.classList.remove("icon-selected");
        
        /*startCamera(videoSources[0],"mycam0", function(){
            for(easyrtcid in occupantIds){
                easyrtc.addStreamToCall(easyrtcid, streamName, function(easyrtcid, streamName){
                            easyrtc.showError("Informational", "other party " + easyrtcid + " acknowledges receiving " + streamName);
                        });
            }
        });*/

    }
    easyrtc.enableCamera(cameraOn,myVideo.streamName);
}

var mute = false;

function muteOrUnmute(e) {
    if(mute) {
    mute = false;
    e.classList.remove("icon-selected");
    } else {
        mute = true;
        e.classList.add("icon-selected");
    }
    
    easyrtc.enableMicrophone(!mute, myVideo.streamName);
}

function startCamera(source, streamName, callback) {
    //alert(streamName);
    easyrtc.setVideoSource(source);
    easyrtc.initMediaSource(
        function(stream) {
            cameraOn = true;
            myVideo.stream = stream;
            myVideo.streamName = streamName;
            easyrtc.setVideoObjectSrc(myVideo.video, stream);
            callback();
        },
        function(errCode, errText) {
            easyrtc.showError(errCode, errText);
        }, streamName);
}

function goconnect() {
    console.log("Initializing.");
    //var roomId = document.title;

    easyrtc.setAutoInitUserMedia(false);
    
    easyrtc.getVideoSourceList(function(videoSrcList) {

        for (var i = 0; i < videoSrcList.length; i++) {
            console.log("videosource: " + videoSrcList[i].deviceId);
            videoSources.push(videoSrcList[i].deviceId);
        }

    fsVideo = document.getElementById('box0');
    fsVideo.width =  window.innerWidth;
    fsVideo.height =  window.innerHeight;
    fsVideo.muted = true;
    fsVideo.classList.add("videoMirror");
    myVideo.video = fsVideo;


    startCamera(videoSources[0],FRONT, function() {

            easyrtc.setRoomOccupantListener(callEverybodyElse);
            easyrtc.connect("roomId", loginSuccess, loginFailure);
        });

    /*easyrtc.setVideoSource(videoSources[0]);
    easyrtc.initMediaSource(
        function(stream) {
            var fullscreenVideo = document.getElementById("box0");
            myStream = stream;
            easyrtc.setVideoObjectSrc(fullscreenVideo, stream);
            fullscreenVideo.width =  window.innerWidth;
            fullscreenVideo.height =  window.innerHeight;
            fullscreenVideo.muted = true;

    easyrtc.setRoomOccupantListener(callEverybodyElse);
    easyrtc.connect(roomId, loginSuccess, loginFailure);
        },
        function(errCode, errText) {
            easyrtc.showError(errCode, errText);
        }, "cam0");*/
    });
}


function hangup() {
    easyrtc.closeLocalStream(myVideo.streamName);
    easyrtc.hangupAll();
    easyrtc.disconnect();
}

function loginSuccess(easyrtcid) {
    fsVideo.tag = myVideo.id = easyrtcid;
}


function loginFailure(errorCode, message) {
    easyrtc.showError(errorCode, message);
}

function indexOfMember(easyrtcid){
    for(var i = 0;i < addedMembers.length;i++){
        if(addedMembers[i].id == easyrtcid) {
            return i;
        }
    }
    return -1;
} 

easyrtc.setOnError(function(errorObject) {
    //alert("OnError:" + errorObject.errorText);
});
/*
easyrtc.setSignalingStateChangeListener(function(easyrtcid,target,state){
    alert("SignalingState: " + state);
});

easyrtc.setIceConnectionStateChangeListener(function(easyrtcid,target,state){
    alert("IceConnectionState: " + state );
});

easyrtc.setPeerOpenListener(function(easyrtcid){
    alert("PeerOpen");
});

easyrtc.setPeerClosedListener(function(easyrtcid){
    alert("PeerClosed");
});

easyrtc.setPeerFailingListener(function(easyrtcid){
    alert("failingHandler");
},function(easyrtcid){
    alert("recoverdHandler");
});*/



easyrtc.setStreamAcceptor(function(easyrtcid, stream, streamName) {
    //alert("got media stream from " + easyrtcid);
    
    var existedMember = addedMembers[indexOfMember(easyrtcid)];

    if(existedMember) {
        var video = existedMember.video;
        easyrtc.setVideoObjectSrc(video, stream);
        existedMember.stream = stream;
        existedMember.streamName = streamName;

    } else {

    var newMember = new Object();
    newMember.id = easyrtcid;
    newMember.stream = stream;
    newMember.streamName = streamName;

    var len = addedMembers.length;    
    var div = document.createElement("div");
    div.classList.add("thumbDiv");
    var video = document.createElement("video");
    video.autoplay = true;
    video.classList.add("thumb");
    video.id = "video" + len;
    div.appendChild(video);
    document.getElementById('videos').appendChild(div);

    if(len > 0){
        easyrtc.setVideoObjectSrc(video, stream);
        video.tag = easyrtcid;
        newMember.video = video;
    }else{
        video.muted = true;
        video.classList.add("videoMirror");
        fsVideo.muted = false;
        fsVideo.classList.remove("videoMirror");
        myVideo.video = video;
        easyrtc.setVideoObjectSrc(video, myVideo.stream);
        easyrtc.setVideoObjectSrc(fsVideo, stream);
        video.tag = myVideo.id;
        fsVideo.tag = easyrtcid;
        
        newMember.video = fsVideo;
    }

    video.addEventListener("click", function(e){
    
        var small = video.tag == myVideo.id ? myVideo : addedMembers[indexOfMember(video.tag)];
        var full = fsVideo.tag == myVideo.id ? myVideo : addedMembers[indexOfMember(fsVideo.tag)];


        if(video.tag == myVideo.id) {
            fsVideo.muted = true;
            fsVideo.classList.add("videoMirror");
            video.muted = false;
            video.classList.remove("videoMirror");
        } else if(fsVideo.tag == myVideo.id) {
            fsVideo.muted = false;
            fsVideo.classList.remove("videoMirror");
            video.muted = true;
            video.classList.add("videoMirror");
        }

        var sv = small.video;
        small.video = full.video;
        full.video = sv;
        var sid = video.tag;
        video.tag = fsVideo.tag;
        fsVideo.tag = sid;

        easyrtc.setVideoObjectSrc(video, full.stream);
        easyrtc.setVideoObjectSrc(fsVideo, small.stream);


        e.stopPropagation();
    });

    /*var newMember = [];
    newMember.push(easyrtcid);
    newMember.push(video);
    newMember.push(stream);
    newMember.push(streamName);*/


    addedMembers.push(newMember);
    }

    
});

easyrtc.setServerListener( function(msgType, msgData, targeting){
        alert("The Server sent " + JSON.stringify(msgData));
    });

easyrtc.setPeerClosedListener(function(easyrtcid){

    var index = indexOfMember(easyrtcid);
    if(index > -1) {
    alert("PeerClosed  " + easyrtcid);
    var member = addedMembers[index];
    addedMembers.splice(index,1);
    var videos = document.getElementById('videos');
    if(member.video == fsVideo) {
        //var gofs = addedMembers.length > 0 ? addedMembers[0] : myVideo;
        var myvid = myVideo.video;
        myVideo.video = fsVideo;
        fsVideo.tag = myVideo.id;

        fsVideo.muted = true;
        fsVideo.classList.add("videoMirror");

        easyrtc.setVideoObjectSrc(fsVideo, myVideo.stream);
        videos.removeChild(myvid.parentNode);
    } else {
        videos.removeChild(member.video.parentNode);
    }
}
});

easyrtc.setOnStreamClosed(function(easyrtcid, stream, streamName) {
    /*alert("StreamClosed  " + easyrtcid);
    if(easyrtcid == myVideo.id)
        return;
    var index = indexOfMember(easyrtcid);
    var member = addedMembers[index];
    addedMembers.splice(index,1);
    var videos = document.getElementById('videos');
    if(member.video == fsVideo) {
        //var gofs = addedMembers.length > 0 ? addedMembers[0] : myVideo;

        var myvid = myVideo.video;
        myVideo.video = fsVideo;
        fsVideo.tag = myVideo.id;
        easyrtc.setVideoObjectSrc(fsVideo, myVideo.stream);
        videos.removeChild(myvid.parentNode);
    } else {
        videos.removeChild(member.video.parentNode);
    }*/
});

easyrtc.setAcceptChecker(function(easyrtcid, callback) {
    //alert(easyrtcid + " is requesting a call");
    callback(addedMembers.length < 4, easyrtc.getLocalMediaIds());
    /*if(addedMembers.length == 3)
        alert("this is already a four member chatroom, no more!");
    else
        alert(easyrtcid + " is requesting a call");*/
});