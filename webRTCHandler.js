import {addIncomingMessageToUi} from "./uiUtils.js";
import { sendOffer , sendAnswer , sendIceCandidates} from "./ws.js";
let pc;
let dataChannel;
const iceCandidatesGenerated = [];
const iceCandidatesReceivedBuffer = [];
const webRTCConfiguratons = {
    iceServers: [
        {
            urls: [
                "stun:stun.l.google.com:19302",
                "stun:stun2.l.google.com:19302",
                "stun:stun3.l.google.com:19302",
                "stun:stun4.l.google.com:19302",
            ]
        }
    ]
};
export function startWebRTCProcess() {
	try{
		let offer;

	    createPeerConnectionObject();
	    createDataChannel(true);

	    pc.createOffer().then(function(createdOffer) {
	        offer = createdOffer;
	        return pc.setLocalDescription(offer);
	    }).then(function() {
	        sendOffer(offer);
	    })
	   }catch(error){
		console.error('Error occurred during WebRTC process:', error);
	  }
}
function createPeerConnectionObject(){
    pc = new RTCPeerConnection(webRTCConfiguratons);
    pc.addEventListener("connectionstatechange", function(){
        console.log("connection state changed to: ", pc.connectionState); 
        if(pc.connectionState === "connected") {
            alert("YOU HAVE DONE IT! A WEBRTC CONNECTION HAS BEEN MADE BETWEEN YOU AND THE OTHER PEER");
        }
    })
    pc.addEventListener("signalingstatechange", function(){
        console.log("Signaling state changed to:" + pc.signalingState);
    })
    pc.addEventListener("icecandidate", function(e){
        if(e.candidate) {
            console.log("ICE:", e.candidate);
            iceCandidatesGenerated.push(e.candidate);
        }
    })
}
function createDataChannel(isOfferor) {
    if (isOfferor) {
        const dataChannelOptions = {
            ordered: false, 
            maxRetransmits: 0
        };
        dataChannel = pc.createDataChannel("top-secret-chat-room", dataChannelOptions);
        registerDataChannelEventListeners();
    } 
    else {
        pc.ondatachannel = function(e){
            console.log("The ondatachannel event was emitted for PEER2. Here is the event object: ", e);
            dataChannel = e.channel;
            registerDataChannelEventListeners();
        }
    }
}
function registerDataChannelEventListeners() {
    dataChannel.addEventListener("message", function(e){
        console.log("message has been received from a Data Channel");
        const msg = e.data; 
        addIncomingMessageToUi(msg);
    });
    dataChannel.addEventListener("close", function(e){
        console.log("The 'close' event was fired on your data channel object");
    });
    dataChannel.addEventListener("open", function(e){ 
        console.log("Data Channel has been opened. You are now ready to send/receive messsages over your Data Channel");
    });
}
export function handleOffer(data) {
	try{
		let answer;
	    createPeerConnectionObject();
	    createDataChannel(false);
	    pc.setRemoteDescription(data.offer).then(function() {
	        return pc.createAnswer();
	    }).then(function(createdAnswer) {
	        answer = createdAnswer;
	        return pc.setLocalDescription(answer);
	    }).then(function() {
	        sendAnswer(answer);
	        sendIceCandidates(iceCandidatesGenerated);
	    })
	}catch(error){
		console.log("Error has been occured while handling offer:->",error);
	}
}
export function handleAnswer(data) {
	try{
		sendIceCandidates(iceCandidatesGenerated);
	    pc.setRemoteDescription(data.answer).then(function() {
	        for (var i = 0; i < iceCandidatesReceivedBuffer.length; i++) {
	            var candidate = iceCandidatesReceivedBuffer[i];
	            pc.addIceCandidate(candidate);
	        }
	        iceCandidatesReceivedBuffer.splice(0, iceCandidatesReceivedBuffer.length);
	    })
	}catch(error){
		console.log("Error has been occured while handling answer:->",error)
	}
}
export function handleIceCandidates(data) {
    if(pc.remoteDescription) {
    	try {
    	    for (var i = 0; i < data.candidatesArray.length; i++) {
    	        var candidate = data.candidatesArray[i];
    	        pc.addIceCandidate(candidate);
    	    }
    	}
        catch (error) {
            console.log("Error trying to add an ice candidate to the pc object", error);
        }
    } else {
        for (var i = 0; i < data.candidatesArray.length; i++) {
            var candidate = data.candidatesArray[i];
            iceCandidatesReceivedBuffer.push(candidate);
        }
    }
}
export function sendMessageUsingDataChannel(message) {
    dataChannel.send(message);
}
export function closePeerConnection() {
    if(pc) {
        pc.close();
        pc = null;
        dataChannel = null;
        console.log("You have closed your peer connection by calling the 'close()' method");
    }
}
