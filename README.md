# Gymkhana-BackServer

Server to send data from sheets to the Gymkhana website

## How does this work?

The data is directly taken from google sheets which are associated with the Gymkhana Technology account. The sheets currently are namely:

- GC Results
- Open IIT Results
- Notices
- Mess Menu (Not implemented Yet!)

# Installation and Setup
To install the dependencies

`npm install`

To start running the server

`node index.js`

# Fetching Data (GET to `/:sheet`)
sheet can be `mess_menu`, `gc`, `openiit`,`events`

Response is an array of JSONs with key values are headers and values are subsequent rows.

## Deployment

The application is deployed on `heroku` with the following link: https://gymk-back.herokuapp.com/

NOTE: AutoDeployment has been enabled to the heroku application from the `master` branch.
