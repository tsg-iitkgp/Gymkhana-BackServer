const express = require('express');
const GoogleSpreadsheet = require('google-spreadsheet');
const creds = require('./client_secret.json');
const cors = require('cors');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

// Google Sheet IDs for different endpoints
const events = '1T8U2y4HccE7eqAHpBHcNJfLJ3PKWuFgx8O9PjpH9Iy0';
const gc = '1W6vkpYIY0saq7I751Vzjnw0RJyCs9ZfqHAp1Ho3RUd8';
const openiit = '1XEvab5tQxPhqjYdBa96k4fTxNLYIlvobOXTSbcKabos';
const mess_menu = '1Wt7KZDasG5X1ElsqpZyRFG32gdqPUOU_qeQuO_u8Oq8';

app.get('/', (req, res) => {
  return res.json({
    message: 'backend working!'
  });
});

app.get('/:sheet', (req, res) => {
  let sheet_id = eval(req.params.sheet);
  let doc = new GoogleSpreadsheet(sheet_id);
  let sheet_data = [];
  doc.useServiceAccountAuth(creds, err => {
    if (err) {
      res.status(500).send('Unable to connect to the database');
      throw new Error('Unable to connect to database');
    }
    const FIRST_SHEET = 1;
    doc.getRows(FIRST_SHEET, (err, rows) => {
      if (err) {
        res.statusCode(500).send('Cannot obtain rows');
        throw new Error('Cannot obtain rows');
      }
      // if there is no data
      if (rows.length === 0) return res.json({ error: 'no data' });

      let keys = Object.keys(rows[0]);
      let useful_keys = keys.slice(4, -2); // discarding the useless keys in response
      for (let row of rows) {
        let row_data = {};
        for (let key of useful_keys) {
          row_data[key] = row[key];
        }
        sheet_data.push(row_data);
      }
      let response_data = JSON.stringify(sheet_data);
      return res.json(response_data);
    });
  });
});
app.listen(PORT, () => console.log('listening to ', PORT));
