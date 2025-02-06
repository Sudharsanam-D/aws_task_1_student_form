import React from "react";
import { useSelector } from "react-redux";
import { Container, Typography, List, ListItem, ListItemText, Paper } from "@mui/material";

const UsersList = () => {
  const users = useSelector((state) => state.users.userList);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: 20, marginTop: 50 }}>
        <Typography variant="h5" gutterBottom>
          Registered Users
        </Typography>
        <List>
          {users.length > 0 ? (
            users.map((user, index) => (
              <ListItem key={index} divider>
                <ListItemText primary={user.name} secondary={user.email} />
              </ListItem>
            ))
          ) : (
            <Typography variant="body1">No users registered yet.</Typography>
          )}
        </List>
      </Paper>
    </Container>
  );
};

export default UsersList;
