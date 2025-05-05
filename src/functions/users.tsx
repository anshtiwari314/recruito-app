import type {UserType,UsersType} from '../reducers/usersReducer'
import type { PayloadAction } from '@reduxjs/toolkit'

export function addNewUser(state:UsersType,action:PayloadAction<UserType>){
    return state
}

export function removeUser(state:UsersType,action:PayloadAction<UserType>){
    return state
}

export function updateUser(state:UsersType,action:PayloadAction<UserType>){
    return state
}