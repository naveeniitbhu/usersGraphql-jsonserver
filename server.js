const express = require('express');
// const {expressGraphQL} = require('express-graphql');
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');

const app = express();
const router = express.Router();

const router2 = express.Router();

app.use('/graphql', router)

app.use(router2)

router2.get('/user', () => {
    console.log('Router2 is working')
});

router.use('/', graphqlHTTP({
    schema, // keya nd value have same name so using ES6 here
    graphiql:true
}));

app.listen(4000, () => {
    console.log('Listening on port 4000');
});