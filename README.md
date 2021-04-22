## Graphql

This project depicts how to create queries and mutation using graphql. Here, we have used json:server to get data and modify data using mutation.

### Installation process:

- npm install
- npm run dev
- npm run json:server

To access graphiql, visit http://localhost:4000/graphql and you can test queries and mutation.

#### Notes:

*-* npm init --yes

*-* npm i express express-graphql graphql lodash

*-* npm i json-server

*-* npm i axios   // we can use node-fetch too instead

*-* npm i nodemon

- Express is responsible for handling in coming HTTP request and sending out response. express-graphql is a compatibility layer between graphql and express. graphql is the actual library used to query our data. lodash is also used here as it contains utility functions.

- Rootquery is an entrypoint. It helps to jump on a specific node in the graph of our data. We can use axios or node-fetch for fetching data.

- The code we used here i.e GraphQLObject etc. (GraphQL Express) is called the reference implementation of graphql.
