import React, {useReducer,useEffect} from 'react';
import StudentContext from './student-context';
import {studentReducer} from "./student-reducer";
import * as Actions from './actions';
import {isAuthenticated} from "../../auth";
const StudentState = props => {
    const [state, dispatch] = useReducer(studentReducer,{
        _id:'',
        name:'',
        email:'',
        role:'',
        isEmailVerified:false
    });
    useEffect(()=>{
        setStudent(isAuthenticated().user);
        console.log(`USE EFFECT STATE: ${JSON.stringify(state)}`)
    },[])
    const setStudent = student => {
        dispatch({
            type:Actions.SET_STUDENT,
            payload:student
        })
    };
    const removeStudent = () => {
        dispatch({
            type:Actions.REMOVE_STUDENT
        })
    };
    return (
        <StudentContext.Provider value={{
            user:state,
            setStudent:setStudent,
            removeStudent:removeStudent
        }}>
            {props.children}
        </StudentContext.Provider>
    );
};

export default StudentState;