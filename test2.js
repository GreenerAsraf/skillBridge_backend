const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');

async function test() {
  const secret = 'lsdngkdsbfgbkdf';
  const token = jwt.sign({ id: 'dummy-user-id', role: 'STUDENT' }, secret, { expiresIn: '1h' });

  const res = await fetch('http://localhost:5000/api/bookings', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      tutorId: 'dummy-tutor-id',
      date: '2026-06-18',
      startTime: '10:00',
      endTime: '11:00'
    })
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Body:', text);
}

test();
