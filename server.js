const express = require('express');
// const {expressGraphQL} = require('express-graphql');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');
const app = express();

app.use('/graphql', graphqlHTTP({
    schema, // keya nd value have same name so using ES6 here
    graphiql:true
}));

app.listen(4000, () => {
    console.log('Listening on port 4000');
});