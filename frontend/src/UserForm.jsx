import React, { useEffect, useState } from "react";
import { TextField, Button, Container, Typography, Paper, Box, IconButton, FormControl, MenuItem, Select, InputLabel } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudents, addStudent, deleteStudent } from "./state/slices/usersSlice";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from "uuid";
import Lottie from "lottie-react";
import loadingAnimation from "./assets/Animation - 1738812287161.json"; 

const StudentForm = () => {
  const [formData, setFormData] = useState({  name: "", email: "", course: "", grade: "" });
  const [errors, setErrors] = useState({ studentName: false, studentEmail: false, studentCourse: false, studentGrade: false });

  const dispatch = useDispatch();
  const { studentList, status, error } = useSelector((state) => state.students);
  // console.log(studentList)

  // Fetch students on mount
  useEffect(() => {
    dispatch(fetchStudents());
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {
      studentName: formData.name.trim() === "",
      studentEmail: !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email),
      studentCourse: formData.course.trim() === "",
      studentGrade: formData.grade.trim() === "",
    };

    setErrors(newErrors);

    if (!Object.values(newErrors).includes(true)) {
      dispatch(addStudent({id:uuidv4(),...formData}));
      setFormData({ name: "", email: "", course: "", grade: "" });
    }
  };

  const handleDelete = (id) => {
    dispatch(deleteStudent(id));
  };

  return (
    <Container maxWidth="md">
      <>
      <ToastContainer/>
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom>
          Student Registration
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField fullWidth label="Student Name" name="name" value={formData.name} onChange={handleChange} error={errors.studentName} helperText={errors.studentName ? "Name is required" : ""} margin="dense" />
          <TextField fullWidth label="Student Email" name="email" type="email" value={formData.email} onChange={handleChange} error={errors.studentEmail} helperText={errors.studentEmail ? "Enter a valid email" : ""} margin="dense" />
          <TextField fullWidth label="Student Course" name="course" value={formData.course} onChange={handleChange} error={errors.studentCourse} helperText={errors.studentCourse ? "Course is required" : ""} margin="dense" />
          <FormControl fullWidth margin="dense" error={errors.studentGrade}>
            <InputLabel id="grade-label">Grade</InputLabel>
            <Select labelId="grade-label" label="Grade" value={formData.grade} onChange={(e) => setFormData({ ...formData, grade: e.target.value })}>
              <MenuItem value="A">A</MenuItem>
              <MenuItem value="B">B</MenuItem>
              <MenuItem value="C">C</MenuItem>
              <MenuItem value="D">D</MenuItem>
              <MenuItem value="F">F</MenuItem>
            </Select>
            {errors.studentGrade && <Typography color="error">Grade is required</Typography>}
          </FormControl>
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: 20 }}>
            Register
          </Button>
        </form>
      </Paper>

      <Paper elevation={3} style={{ padding: 20, marginTop: 30 }}>
        <Typography variant="h5" gutterBottom>
          Registered Students
        </Typography>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: 2 }}>
            <Typography variant="body1" sx={{ width: "23%" }}><strong>Name</strong></Typography>
            <Typography variant="body1" sx={{ width: "27%" }}><strong>Email</strong></Typography>
            <Typography variant="body1" sx={{ width: "23%" }}><strong>Course</strong></Typography>
            <Typography variant="body1" sx={{ width: "17%" }}><strong>Grade</strong></Typography>
            <Typography variant="body1" sx={{ width: "10%" }}><strong></strong></Typography>
          </Box>

          {status === "loading" ? <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "150px" }}>
                <Lottie animationData={loadingAnimation} loop={true} style={{ width: 100, height: 100 }} />
              </Box> : error ? <Typography color="error">{error}</Typography> : studentList.length > 0 ? (
            studentList.map((student) => (
              <Box key={student.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px", borderBottom: "1px solid #ccc", borderRadius: 2 }}>
                <Typography variant="body2" sx={{ width: "23%" }}>{student.name}</Typography>
                <Typography variant="body2" sx={{ width: "27%" }}>{student.email}</Typography>
                <Typography variant="body2" sx={{ width: "23%" }}>{student.course}</Typography>
                <Typography variant="body2" sx={{ width: "17%" }}>{student.grade}</Typography>
                <IconButton edge="end" color="error" onClick={() => handleDelete(student.id)} sx={{ width: "10%" }}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            ))
          ) : <Typography>No students registered yet.</Typography>}
        </Box>
      </Paper>
      </>
    </Container>
  );
};

export default StudentForm;
