import { createSlice } from "@reduxjs/toolkit";

const initialState={
    isNewGroup:false,
    isAddMember:false,
    isMobileMenuFriend:false,
    isNotification:false,
    isSearch:false,
    isFileMenu:false,
    isDeleteMenu:false,
    isDeleteMsgMenu:false,
    uploadingLoader:false,
    selectedDeleteChat:{
        chatId:"",
        groupChat:false,
    },
    selectedDeleteMsg:{
        chatId:"",
        _id:"",
    }

}
const miscSlice=createSlice({
    name:"misc",
    initialState,
    reducers:{
        setIsNewGroup:(state,action)=>{
            state.isNewGroup=action.payload;
        },
        setIsAddMember:(state,action)=>{
            state.isAddMember=action.payload;
        },
        setIsNotification:(state,action)=>{
            state.isNotification=action.payload;
        },
        setIsMobileMenuFriend:(state,action)=>{
            state.isMobileMenuFriend=action.payload;
        },
        setIsSearch:(state,action)=>{
            state.isSearch=action.payload;
        },
        setIsFileMenu:(state,action)=>{
            state.isFileMenu=action.payload;
        },
        setIsDeleteMenu:(state,action)=>{
            state.isDeleteMenu=action.payload;
        },
        setIsDeleteMsgMenu:(state,action)=>{
            state.isDeleteMsgMenu=action.payload;
        },
        setIsUploadingLoader:(state,action)=>{
            state.uploadingLoader=action.payload;
        },
        setSelectedDeleteChat:(state,action)=>{
            state.selectedDeleteChat=action.payload;
        },
        setSelectedDeleteMsg:(state,action)=>{
            state.selectedDeleteMsg=action.payload;
        },


    }
});

export const {setIsAddMember,setIsDeleteMenu,setIsFileMenu,setIsMobileMenuFriend,setIsNewGroup,setIsNotification,setIsSearch,setIsUploadingLoader,setSelectedDeleteChat,setIsDeleteMsgMenu,setSelectedDeleteMsg}=miscSlice.actions;
export default miscSlice;