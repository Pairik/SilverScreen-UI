import { Alert, Button, Snackbar } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { FC, useState } from 'react';
import styles from './MisbehavingUsersW.module.scss';

interface MisbehavingUsersWProps {}

const MisbehavingUsersW: FC<MisbehavingUsersWProps> = () => {

  const [openAlert, setOpenAlert] = useState(false);
  const [alertMsg, setAlertMsg] = useState("Test message.");
  const [alertErr, setAlertErr] = useState(false);
  const [selectedUser, setSelectedUser] = useState(false);

  function SelectUser(userId, username){
    setSelectedUser(userId);
    setAlertMsg(`Selected ${username} with ID ${userId}`);
    setAlertErr(false);
    setOpenAlert(true);
  }

  const columns = [
    { field: 'username', headerName: 'Username', width: 150 },
    { field: 'fakeReports', headerName: 'Fake reports', width: 100 },
    { field: 'reports', headerName: 'Reports', width: 70 },
    { field: 'warnings', headerName: 'Warnings', width: 80 },
    { field: 'actions', headerName: 'Actions', width: 90, sortable: false,
      renderCell: (params) => (
        <strong>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => SelectUser(params.row.id, params.row.username)}
            style={{ marginLeft: 0, background: "#2d5591", color: "#d9d9d9", fontSize: '0.7rem' }}
          >
            Select
          </Button>
        </strong>
      ), 
    }
  ];
  
  const rows = [
    { id: 0, username: 'user1', fakeReports: 12, reports: 24, warnings: 1 },
    { id: 1, username: 'user2', fakeReports: 3, reports: 4, warnings: 0 },
    { id: 2, username: 'user3', fakeReports: 0, reports: 2, warnings: 0 },
  ];
  
  return(
    <div className={styles.MisbehavingUsersW}>
      <div style={{ height: 270, width: 500 }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={3}
          rowsPerPageOptions={[3]}
        />
      </div>
      <div className={styles.AddPriv}>
        <div className={styles.AddPriv_title}>Available actions:</div>
        <Button variant="contained" style={{background: '#333333', color: '#808080', width: '16rem', marginBottom: '0.7rem'}}>Clear user statistics</Button>
        <Button variant="contained" style={{background: '#333333', color: '#808080', width: '16rem', marginBottom: '0.7rem'}}>Issue a warning to the user</Button>
        <Button variant="contained" style={{background: '#333333', color: '#808080', width: '16rem'}}>Issue a ban to the user</Button>
      </div>
      
      <Snackbar open={openAlert} autoHideDuration={2000} onClose={() => setOpenAlert(false)} anchorOrigin={{vertical:'bottom', horizontal:  'right'}}>
        <Alert onClose={() => setOpenAlert(false)} severity={alertErr ? "error" : "success"} sx={{ width: '100%' }}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </div>
  );
}
export default MisbehavingUsersW;
