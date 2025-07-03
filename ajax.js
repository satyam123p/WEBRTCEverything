import {exitRoom}from "./uiUtils.js";
import {type} from "./constants.js";
import {setRoomName} from "./state.js";
export function createRoom(roomName, userId){
	try{
		fetch('http://localhost:8080/create-room', {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json'
	        }, 
	        body: JSON.stringify({roomName:roomName,userId:userId})
	    })
	    .then( function(response){
	    	return response.json(); 
	    })
	    .then(function(resObj){   
	        if(resObj.data.type === type.ROOM_CREATE.RESPONSE_SUCCESS) {
	        	setRoomName(roomName);
	            alert("Room created successfully.");
	        }
	        if(resObj.data.type === type.ROOM_CREATE.RESPONSE_FAILURE) {
	            console.log("Create Room Failure->",resObj.data.message);
	        }
	    });
	}catch(error){
		console.log("Error occured while creating Room:->",error);
	}
}
export function destroyRoom(roomName) {
	try{
		fetch('http://localhost:8080/destroy-room', {
	        method: 'POST',
	        headers: {
	            'Content-Type': 'application/json'
	        }, 
	        body: JSON.stringify({roomName:roomName})
	    })
	    .then(function(response){ return response.json();})
	    .then(function(resObj){   
	        if(resObj.data.type === type.ROOM_DESTROY.RESPONSE_SUCCESS) {
	            exitRoom();
	        }
	        if(resObj.data.type === type.ROOM_DESTROY.RESPONSE_FAILURE) {
	            console.log(resObj.data.message);
	        }
	    });
	}catch(error){
		console.log("Error occured while destroying room:->",error);
	}
}
