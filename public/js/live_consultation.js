var AppProcess = (function () {

    var peers_connection_ids = [];
    var peers_connection = [];
    var remote_vid_stream = [];
    var remote_aud_stream = [];
    var local_div;
    var audio;
    var isAudioMute = true;
    var rtp_aud_senders;
    var video_states = {
        None: 0,
        Camera: 1,
        ScreenShare: 2,
    }
    var video_st = video_states.None;
    var videoCamTrack;

    var serverProcess
    async function _init(SDP_funtion, my_connid) {
        serverProcess = SDP_funtion;
        my_connection_id = my_connid;
        eventProcess();
        local_div = document.getElementById("localVideoPlayer");
    }
    async function loadAudio() {
        try {
            let stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            audio = stream.getAudioTracks()[0];
        } catch (e) {
            console.log("Audio permission denied or error:", e);
            audio = null;
        }
    }
    function updateMediaSenders(track, rtp_senders) {
        if (rtp_senders && rtp_senders.length > 0) {
            rtp_senders.forEach(sender => {
                if (sender && sender.track) {
                    sender.replaceTrack(track);
                }
            });
        }
    }
    function eventProcess() {
        $("#micMuteUnmute").on("click", async function () {
            if (!audio) {
                await loadAudio();
            }
            if (!audio) {
                alert("Audio permission not granted");
                return;
            }
            if (isAudioMute) {
                audio.enabled = true;
                $(this).html('<i class="fa fa-microphone"></i>');
                updateMediaSenders(audio, rtp_aud_senders);
            } else {
                audio.enabled = false;
                $(this).html('<i class="fas fa-microphone-slash"></i>');
                removeMediaSenders(rtp_aud_senders);
            }
            isAudioMute = !isAudioMute
        });
        $("#videoCamOnOff").on("click", async function () {
            if (video_st == video_states.Camera) {
                await videoProcess(video_states.None)
            } else {
                await videoProcess(video_states.Camera)
            }
        });
        // Screen Share On/Off
        $("#ScreenShareOnOff").on("click", async function () {
            if (video_st == video_states.ScreenShare) {
                await videoProcess(video_states.None)
            } else {
                await videoProcess(video_states.ScreenShare)
            }
        });
    }

    async function videoProcess(newVideoState) {
        try {
            var vstream = null;
            if (newVideoState == video_states.Camera) {
                vstream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 1920,
                        height: 1000,
                    },
                    audio: false
                });
            } else if (newVideoState == video_states.ScreenShare) {
                vstream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: 1920,
                        height: 1080,
                    },
                    audio: false
                });
            }
            if (vstream && vstream.getVideoTracks().length > 0) {
                videoCamTrack = vstream.getVideoTracks()[0];
                if (videoCamTrack) {
                    local_div.srcObject = new MediaStream([videoCamTrack]);
                    alert("video cam found")
                }
            };
        } catch (e) {
            console.log(e);
            return;
        }
        video_st = newVideoState;
    }

    const iceConfiguration = {
        iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:stun1.l.google.com:19302" },
            { urls: "stun:stun2.l.google.com:19302" },
            { urls: "stun:stun3.l.google.com:19302" },
            { urls: "stun:stun4.l.google.com:19302" }
        ]
    };
    async function setNewConnection(connid) {
        var connection = new RTCPeerConnection(iceConfiguration);

        connection.onnegotiationneeded = async function (e) {
            await setoffer(connid);
        }
        connection.onicecandidate = function (e) {
            if (e.candidate) {
                serverProcess(JSON.stringify({ Icecandidate: e.candidate }), connid)
            }
        }
        connection.ontrack = function (e) {
            if (!remote_vid_stream[connid]) {
                remote_vid_stream[connid] = new MediaStream();
            }
            if (!remote_aud_stream[connid]) {
                remote_aud_stream[connid] = new MediaStream();
            }
            if (e.track.kind == "video") {
                remote_vid_stream[connid].getVideoTracks().foreach((t) => {
                    remote_vid_stream[connid].removeTrack((t));
                    remote_vid_stream[connid].addTrack(e.track);
                    var remoteVideoPlayer = document.getElementById("v_" + connid);
                    remoteVideoPlayer.srcObject = null;
                    remoteVideoPlayer.srcObject = remote_vid_stream[connid];
                    remoteVideoPlayer.load();
                });
            } else if (e.track.kind == "audio") {
                remote_vid_stream[connid].getAudioTracks().foreach((t) => {
                    remote_aud_stream[connid].removeTrack((t));
                    remote_aud_stream[connid].addTrack(e.track);
                    var remoteAudioPlayer = document.getElementById("a_" + connid);
                    remoteAudioPlayer.srcObject = null;
                    remoteAudioPlayer.srcObject = remote_aud_stream[connid];
                    remoteAudioPlayer.load();
                });

            }
        }
        peers_connection_ids[connid] = connid;
        peers_connection[connid] = connection;

        return connection;
    }
    async function setoffer(connid) {
        var connection = peers_connection[connid];
        var offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        serverProcess(JSON.stringify({
            offer: connection.localDescription,
        }), connid)
    }
    async function SDPProcess(message, from_connid) {
        message = JSON.parse(message);
        if (message.answer) {
            await peers_connection[from_connid].setRemoteDescription(new RTCSessionDescription(message.answer))
        } else if (message.offer) {
            if (!peers_connection[from_connid]) {
                await setNewConnection(from_connid)
            }
            var answer = await peers_connection[from_connid].createAnswer();
            await peers_connection[from_connid].setLocalDescription(answer);

            serverProcess(JSON.stringify({
                answer: answer,
            }), from_connid)
        } else if (message.Icecandidate) {
            if (!peers_connection[from_connid]) {
                await setNewConnection(from_connid);
            }
            try {
                await peers_connection[from_connid].addiceCandidate(message.Icecandidate);
            }
            catch (e) {
                console.log(e)
            }
        }
    }
    return {
        setNewConnection: async function (connid) {
            await setNewConnection(connid);
        },
        init: async function (SDP_funtion, my_connid) {
            await _init(SDP_funtion, my_connid);
        },
        processClientFunction: async function (data, from_connid) {
            await SDPProcess(data, from_connid);
        },
    };
})();

var MyApp = (function () {
    var socket = null
    var user_id = "";
    var appointment_id = "";
    var FullName = "";

    function init(aip, uid, FN) {
        user_id = uid;
        appointment_id = aip;
        FullName = FN;
        $("#meetingContainer").show();
        $("#me h2").text(FullName +" " + "(Me)");
        document.title = FullName
        signaling_server();
    }

    function signaling_server() {
        socket = io.connect();

        var SDP_funtion = function (data, to_connid) {
            socket.emit("SDPProcess", {
                message: data,
                to_connid: to_connid,
                appointment_id: appointment_id // Ensure appointment_id is sent for context
            })
        }
        socket.on("connect", () => {
            // alert("socket connected to client side")
            // LET OTHERS KNOW ABOUT ME
            if (socket.connected) {
                AppProcess.init(SDP_funtion, socket.id)
                if (user_id != "" && appointment_id != "") {
                    // Join the room using appointment_id
                    socket.emit("userconnect", {
                        user_display_id: user_id,
                        appointment_id: appointment_id, // This is the room id
                        user_name: FullName
                    })
                }
            }
            console.log(user_id)
        });

        socket.on("inform_others", function (data) {
            addUser(data.other_users_id, data.connId);
            AppProcess.setNewConnection(data.connId);
        });
        socket.on("infrom_me_about_others", function (other_users) {
            if (other_users) {
                for (var i = 0; i < other_users.length; i++) {
                    addUser(other_users[i].connection_id);
                    AppProcess.setNewConnection(other_users[i].connection_id);
                }
            }
        });
        socket.on("SDPProcess", async function (data) {
            await AppProcess.processClientFunction(data.message, data.from_connid)
        });
    }
    function addUser(other_users_id, connId) {
        var newDivId = $("#otherTemplate").clone();
        newDivId = newDivId.attr("id", connId).addClass('other'); // Fixed typo: addClass
        newDivId.find("h2").text(other_users_id); // Show actual user id
        newDivId.find("video").attr("id", "v_" + connId);
        newDivId.find("audio").attr("id", "a_" + connId);
        newDivId.show();
        $("#divUsers").append(newDivId)
    }


    return {
        _init: function (aip, uid, FN) {
            init(aip, uid, FN)
        }
    }
})();
