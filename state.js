let state = {
    userId: null,
    userWebSocketConnection: null,
    roomName: null,
    otherUserId: null,
};
// set the userId
export function setUserId(userId){
    state.userId=userId;
};
// set the ws object state for the user
export function setWsConnection(wsConnection){
    state.userWebSocketConnection = wsConnection;
};
// set the roomName 
export function setRoomName(roomName){
    state.roomName=roomName;
};
// set the other user's id
export function setOtherUserId(otherUserId){
    state.otherUserId=otherUserId;
};
// reset the state object
export function resetState(){
       state.roomName= null;
       state.otherUserId= null;
};
export function getState(){
    return state;
};
