const express = require('express');
const PORT = 3000;

const app = express();

app.get('/', (req, res) => {
  //write code to extract from sheets
});
app.listen(PORT, () => console.log('listening to ', PORT));
