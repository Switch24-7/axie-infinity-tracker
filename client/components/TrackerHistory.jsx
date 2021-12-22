import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Draggable from 'react-draggable';
import styles from '../styles/TrackerModal.module.css';

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

function DisplayBaseInfo(props) {
  const { accountHistory } = props;
  const columns = [];
  if (accountHistory) {
    const { snapshots } = accountHistory;
    let highestSLP = 0;
    let lowestSLP = Number.MAX_SAFE_INTEGER;
    let avgSLP = 0;
    let quota = 0;
    let missingOrExtra = 0;

    snapshots.forEach((snapshot) => {
      highestSLP = Math.max(highestSLP, snapshot.dayTotal);
      lowestSLP = Math.min(lowestSLP, snapshot.dayTotal);
      avgSLP += snapshot.dayTotal;
      quota = avgSLP;
    });
    avgSLP = Math.round((avgSLP / snapshots.length) * 100) / 100;
    quota = 3000 - quota;
    missingOrExtra = quota - 3000;

    columns.push(<td>{ accountHistory.name }</td>);
    columns.push(<td>{ highestSLP }</td>);
    columns.push(<td>{ lowestSLP }</td>);
    columns.push(<td>{ avgSLP }</td>);
    columns.push(<td>{ quota }</td>);
    columns.push(<td>{ missingOrExtra }</td>);
  }

  return (
    <tr>
      { columns.map((column) => (column)) }
    </tr>
  );
}

function DisplayDays(props) {
  const { accountHistory } = props;
  const { snapshots } = accountHistory;
  const columnHead = [];
  const columnBody = [];

  if (snapshots) {
    for (let idx = snapshots.length - 1; idx >= 0; idx -= 1) {
      const snapshot = snapshots[idx];
      const date = new Date(snapshot.date);
      columnHead.push(
        <th>{ date.toLocaleDateString() }</th>,
      );
      columnBody.push(
        <td>{ snapshot.dayTotal }</td>,
      );
    }
  }

  return (
    <table>
      <thead>
        <tr>
          { columnHead.map((column) => (column)) }
        </tr>
      </thead>
      <tbody>
        <tr>
          { columnBody.map((column) => (column)) }
        </tr>
      </tbody>
    </table>
  );
}

function DisplayTotalSLP(props) {
  const { accountHistory } = props;
  const { snapshots } = accountHistory;
  let totalSLP = 0;

  if (snapshots) {
    snapshots.forEach((snapshot) => {
      totalSLP += snapshot.dayTotal;
    });
  }

  return totalSLP;
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
        <div id={styles['content-container']}>
          <table id={styles['base-info-table']}>
            <thead>
              <tr>
                <th>Scholar</th>
                <th>Highest SLP</th>
                <th>Lowest SLP</th>
                <th>AVG SLP</th>
                <th>15th Days Quota</th>
                <th>Missing/Extra</th>
              </tr>
            </thead>
            <tbody>
              <DisplayBaseInfo accountHistory={accountHistory} />
            </tbody>
          </table>
          <section id={styles['table-container']}>
            <DisplayDays accountHistory={accountHistory} />
          </section>
          <table>
            <thead>
              <tr>
                <th>Total SLP</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <DisplayTotalSLP accountHistory={accountHistory} />
              </tr>
            </tbody>
          </table>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Exit</Button>
      </DialogActions>
    </Dialog>
  );
}
