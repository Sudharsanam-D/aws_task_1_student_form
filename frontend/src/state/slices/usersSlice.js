import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {  toast } from 'react-toastify';


// API Endpoint
const API_URL = "https://f6x83apy2c.execute-api.us-east-1.amazonaws.com/prod/students";

// 🔹 Async Thunks for API calls
export const fetchStudents = createAsyncThunk("students/fetchStudents", async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    toast.error("Failed fetching student details");
    throw new Error("Failed to fetch students"); 
  }
  toast.success("Successly fetched the student details");
  return await response.json();
});

export const addStudent = createAsyncThunk("students/addStudent", async (student) => {
  // const studentDetails = {id:uuidv4(), ...student}
  // console.log(student)
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(student),
  });
  if (!response.ok) {
    toast.error("Failed adding student details");
    throw new Error("Failed to add student"); 
  }
  toast.success("Successly added the student details");
  const data = await response.json();
  // console.log(data);
  return data.studentDetail;
});

export const deleteStudent = createAsyncThunk("students/deleteStudent", async (id) => {
  const obj = {"id":id}
  const response = await fetch(API_URL, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(obj),
  });
  if (!response.ok) {
    toast.error("Failed deleting student details");
    throw new Error("Failed to delete student record"); 
  }
  toast.success("Successly deleted the student details");
  return  id; // Return ID for removal from state
});

// 🔹 Redux Slice
const studentsSlice = createSlice({
  name: "students",
  initialState: { studentList: [], status: "idle", error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch students
      .addCase(fetchStudents.pending, (state) => { state.status = "loading"; })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.studentList = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      // Add student
      .addCase(addStudent.fulfilled, (state, action) => {
        // console.log(action)
        state.studentList.push(action.payload);
      })
      // Delete student
      .addCase(deleteStudent.fulfilled, (state, action) => {
        console.log(action.payload)
        // console.log(state.studentList)
        state.studentList = state.studentList.filter(student => student.id !== action.payload);
      });
  },
});

export default studentsSlice.reducer;
