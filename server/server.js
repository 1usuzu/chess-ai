const express = require('express');
const cors = require('cors');

const gameRoutes = require('./routes/gameRoutes'); 

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

app.use('/api', gameRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server đã sẵn sàng và đang chạy tại http://localhost:${PORT}`);
});