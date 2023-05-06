import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import axios from 'axios';
import { VictoryPie } from 'victory';

const App = () => {
  const [users, setUsers] = useState([]);
  const [chartData, setChartData] = useState({});
  const [mostUsersCountry, setMostUsersCountry] = useState({});

  useEffect(() => {
    // Fetch users from the backend API
    axios
      .get('http://localhost:4000/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Error fetching users:', error);
      });
  }, []);

  useEffect(() => {
    // Calculate the count of users by country
    const countByCountry = users.reduce((acc, user) => {
      const country = user.country;
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {});

    // Format the data for the pie chart
    const chartData = Object.keys(countByCountry).map((country) => ({
      x: country,
      y: countByCountry[country],
    }));

    // Find the country with the most users
    let nOfUsers = 0;
    let mostUsersCountryName = '';
    Object.entries(countByCountry).forEach(([country, count]) => {
      if (count > nOfUsers) {
        nOfUsers = count;
        mostUsersCountryName = country;
      }
    });

    setChartData(chartData);
    setMostUsersCountry({ mostUsersCountryName, nOfUsers });
  }, [users]);

  const handleExcelDownload = () => {
    axios
      .get('http://localhost:4000/users/export/excel', {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'users.xlsx');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error('Error downloading Excel file:', error);
      });
  };

  const handlePDFDownload = (userId) => {
    axios
      .get(`http://localhost:4000/users/export/pdf/${userId}`, {
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'user.pdf');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error('Error downloading PDF file:', error);
      });
  };

  return (
    <div>
      <h2>User List</h2>
      <table className='user-table'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Country</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Address</th>
            <th>Created At</th>
            <th>Updated At</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {users.length !== 0 &&
            users?.map((user) => (
              <tr key={user.id}>
                <td>{user?.id}</td>
                <td>{user?.name}</td>
                <td>{user?.country}</td>
                <td>{user?.phone}</td>
                <td>{user?.email}</td>
                <td>{user?.address}</td>
                <td>{user?.createdAt}</td>
                <td>{user?.updatedAt}</td>
                <td>
                  <button onClick={() => handlePDFDownload(user?.id)}>
                    Download PDF
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      <button style={{ margin: '20px 0' }} onClick={handleExcelDownload}>
        Download Excel
      </button>

      <h2>Users by Country</h2>
      <div className='container'>
        {mostUsersCountry.mostUsersCountryName && (
          <div className='most-users-container'>
            {mostUsersCountry.mostUsersCountryName}:{' '}
            <span>{mostUsersCountry.nOfUsers}</span>
          </div>
        )}
        <div style={{ width: '400px', height: '400px', margin: '20px auto' }}>
          <VictoryPie
            data={chartData}
            colorScale='qualitative'
            innerRadius={110}
            labelRadius={170}
            style={{
              labels: { fontSize: 12, fill: 'black' },
            }}
            className='pie-chart'
          />
        </div>
      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
