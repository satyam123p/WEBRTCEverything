import {DOM,initializeUi,exitRoom,addOutgoingMessageToUi} from "./modules/uiUtils.js";
import {registerSocketEvents,joinRoom,exitingRoom} from "./modules/ws.js";
import {createRoom,destroyRoom} from "./modules/ajax.js";
import {getState} from "./modules/state.js";
import {sendMessageUsingDataChannel,closePeerConnection} from "./modules/webRTCHandler.js";
// Generate unique user code for every user that visits the page
const userId = Math.round(Math.random() * 1000000);
// initialize the DOM
initializeUi(userId);
// establish a ws connection
var wsClientConnection = new WebSocket("ws://localhost:8080/?userId="+userId);
// pass all of our websocket logic to another module
registerSocketEvents(wsClientConnection);
// create room
DOM.createRoomButton.addEventListener("click", function(){
   const roomName = DOM.inputRoomNameElement.value;
   DOM.inputRoomNameElement.value="";
   if(!roomName) {
    return alert("Your room needs a name");
   };
   createRoom(roomName, userId);
});
// delete room
DOM.destroyRoomButton.addEventListener("click", function(){
   const roomName = getState().roomName;
   destroyRoom(roomName);
});
// join room
DOM.joinRoomButton.addEventListener("click", function(){
   const roomName = DOM.inputRoomNameElement.value; 
   DOM.inputRoomNameElement.value="";
   if(!roomName) {
      return alert("You have to join a room with a valid name");
   }
   joinRoom(roomName, userId, wsClientConnection);
});
//exit room
DOM.exitButton.addEventListener("click", function(){
   const roomName = getState().roomName;
   exitRoom();
   exitingRoom(roomName, userId);
   closePeerConnection();
});
//send message
DOM.sendMessageButton.addEventListener("click", function(){
   const message = DOM.messageInputField.value.trim();
   DOM.messageInputField.value="";
   if(message){
      addOutgoingMessageToUi(message);
      sendMessageUsingDataChannel(message);
   };
});
