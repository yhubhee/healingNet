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
    var rtp_vid_senders = []

    var serverProcess;
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
            audio.enabled = false;
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
        $("#ScreenShareOnOff").on("click", async function () {
            if (video_st == video_states.ScreenShare) {
                await videoProcess(video_states.None)
            } else {
                await videoProcess(video_states.ScreenShare)
            }
        });
    }
    function connection_status(connection) {
        if (connection && (connection.connectionState == "new" || connection.connectionState == "connecting" || connection.connectionState == 'connected')) {
            return true;
        } else {
            return false;
        }
    }
    async function updateMediaSenders(track, rtp_senders) {
        for (var conn_id in peers_connection_ids) {
            if (connection_status(peers_connection[conn_id])) {
                if (rtp_senders[conn_id] && rtp_senders[conn_id].track) {
                    rtp_senders[conn_id].replaceTrack(track)
                } else {
                    rtp_senders[conn_id] = peers_connection[conn_id].addTrack(track)
                }
            }
        }
    }

    function removeMediaSenders(rtp_senders) {
        for (var conn_id in peers_connection_ids) {
            if (rtp_senders[conn_id] && connection_status(peers_connection[conn_id])) {
                peers_connection[conn_id].removeTrack(rtp_senders[conn_id]);
                rtp_senders[conn_id] = null;
            }
        }
    }
    function removeVideoStream(rtp_vid_senders) {
        if (videoCamTrack) {
            videoCamTrack.stop();
            videoCamTrack = null;
            local_div.srcObject = null;

            removeMediaSenders(rtp_vid_senders);
        }
    }

    async function videoProcess(newVideoState) {
        if (newVideoState == video_states.None) {
            $("#videoCamOnOff").html("<i class='fas fa-video-slash'></i>");

            $("#ScreenShareOnOff").html("<i class='fas fa-desktop'></i><div> ShareScreen Now </div>")

            video_st = newVideoState;

            removeVideoStream(rtp_vid_senders);
            return;
        }
        if (newVideoState == video_states.Camera) {
            $("#videoCamOnOff").html("<i class='fas fa-video'></i>")
        }
        try {
            var vstream = null;
            if (newVideoState == video_states.Camera) {
                vstream = await navigator.mediaDevices.getUserMedia({
                    video: {
                        width: 3840,
                        height: 2160,
                    },
                    audio: false
                });
            } else if (newVideoState == video_states.ScreenShare) {
                vstream = await navigator.mediaDevices.getDisplayMedia({
                    video: {
                        width: 3840,
                        height: 2160,
                    },
                    audio: false
                });
                vstream.oninactive = (e) => {
                    removeVideoStream(rtp_vid_senders);
                    $("#ScreenShareOnOff").html("<i class='fas fa-desktop'></i><div>ShareScreen Now</div>");
                }
            }
            if (vstream && vstream.getVideoTracks().length > 0) {
                videoCamTrack = vstream.getVideoTracks()[0];
                if (videoCamTrack) {
                    local_div.srcObject = new MediaStream([videoCamTrack]);
                    updateMediaSenders(videoCamTrack, rtp_vid_senders);
                    alert("video good")
                }
            }
        } catch (e) {
            console.log(e);
            return;
        }
        video_st = newVideoState;
        if (newVideoState == video_states.Camera) {
            $("#videoCamOnOff").html('<i class="fas fa-video"></i>');
            $("#ScreenShareOnOff").html("<i class='fas fa-desktop'></i><div>ShareScreen Now</div>");
        } else if (newVideoState == video_states.ScreenShare) {
            $("#videoCamOnOff").html('<i class="fas fa-video-slash"></i>');
            $("#ScreenShareOnOff").html("<i class='fas fa-desktop'></i><div class='text-danger'>Stop ScreenShare Now</div>")
        }

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
                remote_vid_stream[connid].getVideoTracks().forEach((t) => {
                    remote_vid_stream[connid].removeTrack(t);
                });
                remote_vid_stream[connid].addTrack(e.track);
                var remoteVideoPlayer = document.getElementById("v_" + connid);
                if (remoteVideoPlayer) {
                    remoteVideoPlayer.srcObject = null;
                    remoteVideoPlayer.srcObject = remote_vid_stream[connid];
                    remoteVideoPlayer.load();
                }
            } else if (e.track.kind == "audio") {
                remote_aud_stream[connid].getAudioTracks().forEach((t) => {
                    remote_aud_stream[connid].removeTrack(t);
                });
                remote_aud_stream[connid].addTrack(e.track);
                var remoteAudioPlayer = document.getElementById("a_" + connid);
                if (remoteAudioPlayer) {
                    remoteAudioPlayer.srcObject = null;
                    remoteAudioPlayer.srcObject = remote_aud_stream[connid];
                    remoteAudioPlayer.load();
                }
            }
        }
        peers_connection_ids[connid] = connid;
        peers_connection[connid] = connection;

        if (video_st == video_states.Camera || video_st == video_states.ScreenShare) {
            if (videoCamTrack) {
                updateMediaSenders(videoCamTrack, rtp_vid_senders);
            }
        }
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
    // Add a map to store pending ICE candidates for each connection
    var pendingIceCandidates = {};

    async function SDPProcess(message, from_connid) {
        message = JSON.parse(message);
        if (message.answer) {
            await peers_connection[from_connid].setRemoteDescription(new RTCSessionDescription(message.answer));
            // Process any queued ICE candidates after remote description is set
            if (pendingIceCandidates[from_connid]) {
                for (let candidate of pendingIceCandidates[from_connid]) {
                    try {
                        await peers_connection[from_connid].addIceCandidate(candidate);
                    } catch (e) {
                        console.log(e);
                    }
                }
                delete pendingIceCandidates[from_connid];
            }
        } else if (message.offer) {
            if (!peers_connection[from_connid]) {
                await setNewConnection(from_connid)
            }
            // Set remote description before creating answer
            await peers_connection[from_connid].setRemoteDescription(new RTCSessionDescription(message.offer));
            var answer = await peers_connection[from_connid].createAnswer();
            await peers_connection[from_connid].setLocalDescription(answer);

            serverProcess(JSON.stringify({
                answer: answer,
            }), from_connid);

            // Process any queued ICE candidates after remote description is set
            if (pendingIceCandidates[from_connid]) {
                for (let candidate of pendingIceCandidates[from_connid]) {
                    try {
                        await peers_connection[from_connid].addIceCandidate(candidate);
                    } catch (e) {
                        console.log(e);
                    }
                }
                delete pendingIceCandidates[from_connid];
            }
        } else if (message.Icecandidate) {
            if (!peers_connection[from_connid]) {
                await setNewConnection(from_connid);
            }
            // If remote description is not set yet, queue the ICE candidate
            if (!peers_connection[from_connid].remoteDescription || !peers_connection[from_connid].remoteDescription.type) {
                if (!pendingIceCandidates[from_connid]) {
                    pendingIceCandidates[from_connid] = [];
                }
                pendingIceCandidates[from_connid].push(message.Icecandidate);
            } else {
                try {
                    await peers_connection[from_connid].addIceCandidate(message.Icecandidate);
                }
                catch (e) {
                    console.log(e)
                }
            }
        }
    }
    async function closeConnection(connid) {
        peers_connection_ids[connid] = null;
        if (peers_connection[connid]) {
            peers_connection[connid].close();
            peers_connection[connid] = null;
        }
        if (remote_aud_stream[connid]) {
            remote_aud_stream[connid].getTracks().forEach((t) => {
                if (t.stop) t.stop();
            });
            remote_aud_stream[connid] = null;
        }
        if (remote_vid_stream[connid]) {
            remote_vid_stream[connid].getTracks().forEach((t) => {
                if (t.stop) t.stop();
            });
            remote_vid_stream[connid] = null;
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
        closeConnectionCall: async function (connid) {
            await closeConnection(connid);
        },
    };
})();

var MyApp = (function () {
    var socket = null;
    var user_id = "";
    var appointment_id = "";
    var FullName = "";
    // Track all connected user connection IDs
    var userConnections = [];

    function init(aip, uid, FN) {
        user_id = uid;
        appointment_id = aip;
        FullName = FN;
        $("#me h2").text(FullName + " (Me)");
        document.title = FullName;
        signaling_server();
        eventHandling();
    }

    function updateParticipantCount() {
        // +1 for self
        $("#participant-count").text(userConnections.length + 1);
    }

    function signaling_server() {
        socket = io.connect();

        var SDP_funtion = function (data, to_connid) {
            socket.emit("SDPProcess", {
                message: data,
                to_connid: to_connid,
                appointment_id: appointment_id
            });
        }
        socket.on("connect", () => {
            if (socket.connected) {
                AppProcess.init(SDP_funtion, socket.id);
                if (user_id != "" && appointment_id != "") {
                    socket.emit("userconnect", {
                        user_display_id: user_id,
                        appointment_id: appointment_id,
                        user_name: FullName
                    });
                }
            }
            console.log(FullName);
        });
        socket.on("inform_about_disconnections", function (data) {
            $("#" + data.connId).remove();
            $(".participant-count").text(data.uNumber)
            $("#participants_" + data.connId + "").remove();
            // Remove from userConnections
            userConnections = userConnections.filter(id => id !== data.connId);
            updateParticipantCount();
            AppProcess.closeConnectionCall(data.connId)
        });

        socket.on("inform_others", function (data) {
            // Add to userConnections if not already present
            if (!userConnections.includes(data.connId)) {
                userConnections.push(data.connId);
            }
            addUser(data.other_users, data.connId);
            updateParticipantCount();
            AppProcess.setNewConnection(data.connId);
        });
        socket.on("inform_me_about_others", function (other_users) {
            // Reset userConnections
            userConnections = [];
            if (other_users) {
                for (var i = 0; i < other_users.length; i++) {
                    userConnections.push(other_users[i].connection_id);
                    addUser(other_users[i], other_users[i].connection_id);
                    AppProcess.setNewConnection(other_users[i].connection_id);
                }
            }
            updateParticipantCount();
        });
        socket.on("SDPProcess", async function (data) {
            await AppProcess.processClientFunction(data.message, data.from_connid);
        });

        socket.on("showChatMessage", function (data) {
            var time = new Date();
            var lTime = time.toLocaleString("en-us", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            });
            var div = $("<div>")
                .addClass("other-message text-end mb-2")
                .html(
                    "<span class='font-weight-bold ms-3' style='color:black'>" + data.from + "</span> " +
                    lTime + "<br>" +
                    $("<div>").text(data.message).html()
                );
            $("#messages").append(div);
        });
    }
    function eventHandling() {
        // Handle form submit for both button click and Enter key
        $("#chatInputForm").on("submit", function (e) {
            e.preventDefault();
            const msg = $("#msgbox").val().trim();
            var time = new Date();
            var lTime = time.toLocaleString("en-us", {
                hour: "numeric",
                minute: "numeric",
                hour12: true
            });
            var div = $("<div>")
                .addClass("my-message text-start mb-2")
                .html(
                    "<span class='font-weight-bold me-3' style='color: #3a6186'>" +
                    $("<div>").text(FullName + " (Me)").html() +
                    "</span> " +
                    lTime + "<br>" +
                    $("<div>").text(msg).html()
                );
            $("#messages").append(div);

            if (msg) {
                socket.emit("sendMessage", msg);
                $("#msgbox").val("");
            }
        });
    }
    function addUser(other_users, connId) {
        // Display both user_name and user_display_id
        var displayName = other_users.user_name + " (" + other_users.user_display_id + ")";
        var newDivId = $("#otherTemplate").clone();
        newDivId = newDivId.attr("id", connId).addClass('other');
        newDivId.find("h2").text(displayName);
        newDivId.find("video").attr("id", "v_" + connId);
        newDivId.find("audio").attr("id", "a_" + connId);
        newDivId.show();
        $(".g-top").append(newDivId);
        $(".participant-list").append(' <div class="d-flex align-items-center mb-2 px-2 py-1 rounded" id="participants_' + connId +'" style="background: rgba(0, 0, 0, 0.05);"> <img src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png" alt="avatar" width="32" height="32" class="rounded-circle mr-2 border" style="object-fit: cover; border-color: #ddd;"> <span class="font-weight-bold text-dark">'+ displayName +'</span> </div> <div class="d-flex align-items-center gap-3"> <i class="fas fa-ellipsis-v mx-2" style="cursor:pointer; color: #888; font-size: 1.1rem;"></i> <i class="fas fa-thumbtack" style="cursor:pointer; color: #888; font-size: 1.1rem;"></i> </div>'
        );
    }

    return {
        _init: function (aip, uid, FN) {
            init(aip, uid, FN);
        }
    };
})();