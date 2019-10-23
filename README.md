# Gymkhana-Server
Server to send data from sheets to the Gymkhana website

# Installation and Setup
To install the dependencies

`npm install`

To start running the server

`node index.js`

# Fetching Data (GET to `/:sheet`)
sheet can be `mess_menu`, `gc`, `openiit`,`events`

Response is an array of JSONs with key values are headers and values are subsequent rows.
