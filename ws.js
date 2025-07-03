import {setWsConnection,getState,setOtherUserId,setRoomName} from "./state.js";
import {updateUiForRemainingUser} from "./uiUtils.js";
import {labels,type} from "./constants.js";
import {handleOffer,handleAnswer,handleIceCandidates,startWebRTCProcess,closePeerConnection} from "./webRTCHandler.js";
// EVENT LISTENERS THAT THE BROWSER'S WEBSOCKET OBJECT GIVES US
export function registerSocketEvents(wsClientConnection){
    // update our user state with this wsClientConnection
    setWsConnection(wsClientConnection);
    // listen for those 4 events
    wsClientConnection.onopen = function(){
        // tell the user that they have connected with our ws server
        console.log("You have connected with our websocket server");

        // register the remaining 3 events
        wsClientConnection.onmessage = handleMessage;
        wsClientConnection.onclose = handleClose;
        wsClientConnection.onerror = handleError;
    };
};
function handleClose() {
    console.log("You have been disconnected from our ws server");
};

function handleError() {
    console.log("An error was thrown while listening on onerror event on websocket");
}
export function joinRoom(roomName,userId){
    const message = {
        label:labels.NORMAL_SERVER_PROCESS,
        data: {
            type:type.ROOM_JOIN.REQUEST,
            roomName:roomName,
            userId:userId
        }
    };
    getState().userWebSocketConnection.send(JSON.stringify(message));
}
export function exitingRoom(roomName, userId) {
    const message = {
        label:labels.NORMAL_SERVER_PROCESS,
        data: {
            type:type.ROOM_EXIT.REQUEST,
            roomName:roomName,
            userId:userId
        }
    };
    getState().userWebSocketConnection.send(JSON.stringify(message));
}
export function sendOffer(offer) {
    const message = {
        label:labels.WEBRTC_PROCESS,
        data: {
            type:type.WEB_RTC.OFFER,
            offer:offer, 
            otherUserId:getState().otherUserId
        }
    };
    getState().userWebSocketConnection.send(JSON.stringify(message));
};
export function sendAnswer(answer) {
    const message = {
        label: labels.WEBRTC_PROCESS, 
        data: {
            type:type.WEB_RTC.ANSWER,
            answer:answer, 
            otherUserId:getState().otherUserId
        }
    };
    getState().userWebSocketConnection.send(JSON.stringify(message));
};
export function sendIceCandidates(arrayOfIceCandidates) {
    const message = {
        label:labels.WEBRTC_PROCESS,
        data: {
            type:type.WEB_RTC.ICE_CANDIDATES,
            candidatesArray: arrayOfIceCandidates,
            otherUserId:getState().otherUserId
        }
    };
    getState().userWebSocketConnection.send(JSON.stringify(message));
};

function handleMessage(incomingMessageEventObject) {
    const message = JSON.parse(incomingMessageEventObject.data);
    // process an incoming message depending on its label
    switch(message.label) {
        // NORMAL SERVER STUFF
        case labels.NORMAL_SERVER_PROCESS:
            normalServerProcessing(message.data);
            break;
        // WEBRTC SERVER STUFF
        case labels.WEBRTC_PROCESS:
            webRTCServerProcessing(message.data);
            break;
        default: 
            console.log("unknown server processing label: ", message.label);
    }
};
function normalServerProcessing(data) {
    // process the message depending on its data type
    switch(data.type) {
        // join room - success
        case type.ROOM_JOIN.RESPONSE_SUCCESS: 
            joinSuccessHandler(data);
            alert("Join room successful");
            break; 
        // join room - failure
        case type.ROOM_JOIN.RESPONSE_FAILURE: 
            console.log("join room failed");
            break; 
        // join room - notification
        case type.ROOM_JOIN.NOTIFY: 
            joinNotificationHandler(data);
            break; 
        // exit room - notification
        case type.ROOM_EXIT.NOTIFY:
            exitNotificationHandler(data);
            break;
        // disconnection - notification
        case type.ROOM_DISONNECTION.NOTIFY:
            exitNotificationHandler(data);
            break;
        // catch-all
        default: 
            console.log("unknown data type: ", data.type);
    }
};

function webRTCServerProcessing(data) {
    switch(data.type) {
        case type.WEB_RTC.OFFER:
            handleOffer(data);
            break;
        case type.WEB_RTC.ANSWER:
            handleAnswer(data);
            break; 
        case type.WEB_RTC.ICE_CANDIDATES:
        	handleIceCandidates(data);
            break; 
        default: 
            console.log("Unknown data type: ", data.type);
    }
};
function joinSuccessHandler(data) {
    setOtherUserId(data.creatorId);
    setRoomName(data.roomName);
    startWebRTCProcess(); 
}
function joinNotificationHandler(data) {
    alert(data.joinUserId + " has joined your room");
    setOtherUserId(data.joinUserId);
}
function exitNotificationHandler() {
	updateUiForRemainingUser();
    closePeerConnection();
}
