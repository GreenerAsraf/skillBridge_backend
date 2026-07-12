const fetch = require('node-fetch');

async function test() {
  const res = await fetch('https://skillbridge-backend-xm86.onrender.com/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tutorId: 'test-tutor-id',
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
