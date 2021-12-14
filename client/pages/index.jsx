import React, { useState } from 'react';
import Head from 'next/head';
import TrackerHistory from '../components/TrackerHistory';
import trackerStyles from '../styles/Tracker.module.css';

export async function getStaticProps() {
  const promises = [];
  const data = await fetch(`${process.env.API}/slp/history`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());

  data.forEach((datum) => {
    promises.push(fetch(`${process.env.API}/slp/today?eth=${datum.eth}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((res) => res.json()).then((json) => ({
      eth: datum.eth,
      name: datum.name,
      managerShare: datum.managerShare,
      today: json.today,
      snapshots: datum.snapshots,
    })));
  });

  const accounts = await Promise.all(promises).then((result) => result);
  return {
    revalidate: 1,
    props: { accounts },
  };
}

export default function Home({ accounts }) {
  const [open, setOpen] = useState(false);
  const [accountHistory, setAccountHistory] = useState(undefined);

  function openModal(acc) {
    setAccountHistory(acc);
    setOpen(true);
  }

  const DisplayRows = React.memo((props) => {
    // eslint-disable-next-line no-shadow
    const { accounts } = props;
    if (accounts) {
      const rows = accounts.map((account) => {
        const total = account.today + account.snapshots[0] ? account.snapshots[0].currentTotal : 0;
        const managerShare = Math.round((account.managerShare / 100) * total);
        const scholarShare = total - managerShare;
        return (
          <tr className={trackerStyles['tracker-row']}>
            <td className={trackerStyles['tracker-row-name']}>{ account.name }</td>
            <td className={trackerStyles['tracker-row-center']}>{ account.today }</td>
            <td className={trackerStyles['tracker-row-center']}>{ account.snapshots[0] ? account.snapshots[0].dayTotal : 0 }</td>
            <td className={trackerStyles['tracker-row-center']}>{ scholarShare }</td>
            <td className={trackerStyles['tracker-row-center']}>{ managerShare }</td>
            <td className={trackerStyles['tracker-row-center']}>{ total }</td>
            <td className={`${trackerStyles['tracker-row-history']} ${trackerStyles['tracker-row-center']}`}>
              <button type="button" onClick={() => openModal(account)}>More Details</button>
            </td>
          </tr>
        );
      });
      return rows;
    } return (<tr />);
  });

  return (
    <div>
      <Head>
        <title>NAS Academy Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <TrackerHistory open={open} setOpen={setOpen} accountHistory={accountHistory} />
        <div id={trackerStyles['tracker-container']}>
          <div id={trackerStyles['tracker-content']}>
            <table id={trackerStyles['tracker-table']}>
              <thead>
                <tr>
                  <th id={trackerStyles['tracker-name']}>Name</th>
                  <th id={trackerStyles['tracker-today']}>Today</th>
                  <th id={trackerStyles['tracker-yesterday']}>Yesterday</th>
                  <th id={trackerStyles['tracker-scholar']}>Scholar</th>
                  <th id={trackerStyles['tracker-manager']}>Manager</th>
                  <th id={trackerStyles['tracker-total']}>Total</th>
                  <th id={trackerStyles['tracker-history']}>History</th>
                </tr>
              </thead>
              <tbody>
                <DisplayRows accounts={accounts} />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
