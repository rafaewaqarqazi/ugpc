import fetch from "isomorphic-unfetch";
import {serverUrl} from "../config";
import {isAuthenticated} from "../../auth";

export const fetchNotEnrolledStudents = async () => {
  const res = await fetch(`${serverUrl}/students/notEnrolled/${isAuthenticated().user._id}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    }
  });
  return await res.json();
};

export const createProjectAPI = async (data) => {
  const res = await fetch(`${serverUrl}/students/project/new`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const fetchProjectByStudentIdAPI = async () => {
  try {
    const res = await fetch(`${serverUrl}/projects/by/studentId/${isAuthenticated().user._id}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        "Content-Type": 'application/json',
        Authorization: `Bearer ${isAuthenticated().token}`
      }
    });
    return await res.json();
  } catch (e) {
    console.error(e.message)
  }

};

export const fetchProjectByProjectIdAPI = async projectId => {
  const res = await fetch(`${serverUrl}/projects/by/projectId/${projectId}`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    }
  });
  return await res.json();
};
export const uploadVisionAPI = async (data, projectId) => {
  const res = await fetch(`${serverUrl}/students/project/vision-doc/pdf/${projectId}`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: data
  });
  return await res.json();
};

export const uploadFinalDocumentationAPI = async (data) => {
  const res = await fetch(`${serverUrl}/students/project/finalDocumentation/pdf`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: data
  });
  return await res.json();
};
export const addTaskToBacklogAPI = async (projectId, task) => {
  const res = await fetch(`${serverUrl}/backlog/task/add`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify({projectId, task})
  });
  return await res.json();
};

export const planSprintAPI = async data => {
  const res = await fetch(`${serverUrl}/backlog/sprint/plan`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const changeColumnAPI = async data => {
  const res = await fetch(`${serverUrl}/backlog/task/change/column`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const changePriorityDnDAPI = async data => {
  const res = await fetch(`${serverUrl}/backlog/task/change/priority`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const completeSprintAPI = async data => {
  const res = await fetch(`${serverUrl}/backlog/sprint/complete`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const removeTaskAPI = async data => {
  const res = await fetch(`${serverUrl}/backlog/task/remove`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};

export const removeAttachmentFromTaskAPI = async data => {
  const res = await fetch(`${serverUrl}/backlog/task/remove/attachment`, {
    method: 'PUT',
    headers: {
      Accept: 'application/json',
      "Content-Type": 'application/json',
      Authorization: `Bearer ${isAuthenticated().token}`
    },
    body: JSON.stringify(data)
  });
  return await res.json();
};