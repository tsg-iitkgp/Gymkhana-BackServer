const express = require("express");
const GoogleSpreadsheet = require("google-spreadsheet");
const creds = require("./client_secret.json");
const cors = require("cors");
const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());

// Google Sheet IDs for different endpoints
const events = "1T8U2y4HccE7eqAHpBHcNJfLJ3PKWuFgx8O9PjpH9Iy0";
const gc = "1W6vkpYIY0saq7I751Vzjnw0RJyCs9ZfqHAp1Ho3RUd8";
const openiit = "1XEvab5tQxPhqjYdBa96k4fTxNLYIlvobOXTSbcKabos";
const mess_menu = "1Wt7KZDasG5X1ElsqpZyRFG32gdqPUOU_qeQuO_u8Oq8";

app.get("/", (req, res) => {
  return res.json({
    message: "backend working!"
  });
});


app.get("/mess/:hall", (req, res) => {
  /*
    Endpoint for MESS MENU
    Endpoint URL_PARAMS = '/mess/HALL_NAME_AS_PER_THE_SHEET_TITLE_IN_LOWER_CASE'  
    response = [
        { 
          time: "Breakfast",
          "monday": "sheet_cell_value",
          "tuesday": "sheet_cell_value",
          ...
          "sunday": "sheBreakfastet_cell_value"
        },
        { 
          time: "Lunch",
          "monday": "sheet_cell_value",
          "tuesday": "sheet_cell_value",
          ...
          "sunday": "sheet_cell_value"
        },
        { 
          time: "Snacks",
          "monday": "sheet_cell_value",
          "tuesday": "sheet_cell_value",
          ...
          "sunday": "sheet_cell_value"
        }
        { 
          time: "Dinner",
          "monday": "sheet_cell_value",
          "tuesday": "sheet_cell_value",
          ...
          "sunday": "sheet_cell_value"
        }
    ]
    */
  let sheet_id = "1Wt7KZDasG5X1ElsqpZyRFG32gdqPUOU_qeQuO_u8Oq8";
  let doc = new GoogleSpreadsheet(sheet_id);

  doc.useServiceAccountAuth(creds, err => {
    if (err) {
      res.status(500).send("Unable to connect to the Database");
      throw new Error("Unable to connect to database");
    }

    doc.getInfo((err, info) => {
      if (err) {
        res.status(500).send("Unable to fetch Data from the database");
        throw new Error("Unable to fetch Data from the database");
      }

      for (let sheet of info.worksheets) {
        if (sheet.title.toLowerCase() === req.params.hall) {
          sheet.getRows((err, rows) => {
            let keys = Object.keys(rows[0]);
            let useful_keys = keys.slice(4, -2); // discarding the useless keys in response

            let mess_menu = [];
            for (let row of rows) {
              let row_data = {};
              for (let key of useful_keys) {
                row_data[key] = row[key];
              }
              mess_menu.push(row_data);
            }

            let response_data = JSON.stringify(mess_menu);
            res.json(response_data);
          });
        }
      }
    });
  });
});


app.get("/:sheet", (req, res) => {
  /*
    Endpoint for events, gc, openiit  
    Endpoint URL_PARAMS = '/ONE_OF_THE_ABOVE_THREE'
    
    Sample Response for '/events' = [
      {
        "nameoftheevent":"Notice Board Launch",
        "organiser":"Gymkhana","date":"October 25",
        "time":"11:55 PM",
        "venue":"-",
        "registrationlinkfbpost":"-"
      }
    ]

    Sample Response for '/gc' = [
      {
        "eventname":"SHEET_CELL_VALUE",
        "eventcup":"SHEET_CELL_VALUE",
        "eventpoints":"SHEET_CELL_VALUE",
        "winner":"SHEET_CELL_VALUE",
        "runnersup":"SHEET_CELL_VALUE",
        "secondrunnersup":"SHEET_CELL_VALUE",
        "domaintechsocultsports":"SHEET_CELL_VALUE"
      }
    ]

    Sample Response for '/openiit' = [
      {
        "date":"SHEET_CELL_VALUE",
        "eventname":"SHEET_CELL_VALUE",
        "winner":"SHEET_CELL_VALUE",
        "runnersup":"SHEET_CELL_VALUE",
        "secondrunnersup":"SHEET_CELL_VALUE"
      }
    ]

  */ 
 
  let sheet_id = eval(req.params.sheet);
  let doc = new GoogleSpreadsheet(sheet_id);
  let sheet_data = [];
  doc.useServiceAccountAuth(creds, err => {
    
    if (err) {
      res.status(500).send('Unable to connect to the database');
      throw new Error('Unable to connect to database');
    }

    doc.getRows(1, (err, rows) => {
      if (err) {
        res.statusCode(500).send('Cannot obtain rows');
        throw new Error('Cannot obtain rows');
      }
      
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

app.listen(PORT, () => console.log("listening to ", PORT));
