import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import styles from '../styles/Tracker.module.css';

function PaperComponent(props) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

function DisplayRows(props) {
  const { accountHistory } = props;
  const { snapshots } = accountHistory;
  if (snapshots) {
    const rows = snapshots.map((snapshot) => {
      const date = new Date(snapshot.date);
      const managerShare = Math.round((accountHistory.managerShare / 100) * snapshot.currentTotal);
      const scholarShare = snapshot.currentTotal - managerShare;
      return (
        <tr className={styles['tracker-row']}>
          <td id={styles['tracker-row-center']}>{ date.toLocaleDateString() }</td>
          <td id={styles['tracker-row-center']}>{ snapshot.dayTotal }</td>
          <td id={styles['tracker-row-center']}>{ scholarShare }</td>
          <td id={styles['tracker-row-center']}>{ managerShare }</td>
          <td id={styles['tracker-row-center']}>{ snapshot.currentTotal }</td>
        </tr>
      );
    });
    return rows;
  } return (<tr />);
}

export default function TrackerHistory({ open, setOpen, accountHistory }) {
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
      fullWidth
      maxWidth="lg"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {
          accountHistory
            ? `${accountHistory.name}, ${accountHistory.eth}`
            : 'History'
        }
      </DialogTitle>
      <DialogContent
        style={{ height: '80vh' }}
        fullWidth
      >
        <table id={styles['tracker-modal-table']}>
          <thead>
            <tr className={styles['tracker-row']}>
              <th>Date</th>
              <th>SLP Earned</th>
              <th>Scholar</th>
              <th>Manager</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            <DisplayRows accountHistory={accountHistory} />
          </tbody>
        </table>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Exit</Button>
      </DialogActions>
    </Dialog>
  );
}
