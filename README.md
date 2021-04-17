#### Graphql
- npm init --yes 
- npm i express express-graphql graphql lodash
- npm i json-server
- npm i axios
- npm i nodemon

// express is responsibel for handling in coming HTTP request and sending out response. express-graphql is a compatibility layer between graphql and express. graphql is the actual library used to query our data. lodash is library containing utility functions.

// express checks if the request is asking for graphql. if it is then it is handed over to graphql.

// rootquery is an entrypoint. It helps to jump on a specific node in the graph of our data.

// you can use axios or node-fetch for fetching data

- Run below code to run servers
- npm run dev
- npm run json:server