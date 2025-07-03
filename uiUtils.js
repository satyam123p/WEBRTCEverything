import {setUserId,resetState,setOtherUserId,getState } from "./state.js";
const inputRoomNameElement = document.getElementById('input_room_channel_name');
const joinRoomButton = document.getElementById('join_button');
const createRoomButton = document.getElementById('create_room_button');
const messageInputField = document.getElementById('message_input_field');
const sendMessageButton = document.getElementById('send_message_button');
const destroyRoomButton = document.getElementById('destroy_button');
const exitButton = document.getElementById('exit_button');
const messageContainer = document.getElementById("message-container");
export var DOM = { 
		createRoomButton:createRoomButton,
        inputRoomNameElement:inputRoomNameElement,
        destroyRoomButton:destroyRoomButton,
        joinRoomButton:joinRoomButton,
        exitButton:exitButton,
        sendMessageButton:sendMessageButton,
        messageInputField:messageInputField,
};
export function initializeUi(userId) {
	setUserId(userId);
};
export function exitRoom() {
    inputRoomNameElement.value = '';
    resetState();
};
export function updateUiForRemainingUser() {
    alert("a user has left your room");
    setOtherUserId(null);
};
export function addOutgoingMessageToUi(message) {
    var userId = "YOU";
    var formattedMessage = userId + ":" + message;
    var p = document.createElement("p");
    p.textContent = formattedMessage;
    messageContainer.appendChild(p);
}
export function addIncomingMessageToUi(msg) {
    var otherUserId = getState().otherUserId;
    var formattedMessage = otherUserId + ":" + msg;
    var p = document.createElement("p");
    p.textContent = formattedMessage;
    messageContainer.appendChild(p);
}
