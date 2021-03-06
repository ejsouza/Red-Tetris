import express from 'express';

const app = express();

const PORT: number = +(process.env.PORT || 8000);

app.get('/', (req, res) => res.send('Express + typescript server'));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

