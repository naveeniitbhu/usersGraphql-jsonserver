const graphql = require('graphql');
// const _ = require('lodash');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, //takes a rootquery and returns a graphqlschema instance
  GraphQLList
} = graphql;

// const users = [
//   { id: '23', firstName: 'Bill', age:20 },
//   { id: '47', firstName: 'Samantha', age:21 }
// ];

// CompanyType and UserType circular referernce error
// Use arrow functions to avoid this since the functions get defined but is executed
// only when the whole file is executed. 

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    users: {
      type: new GraphQLList(UserType),
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3010/companies/${parentValue.id}/users`)
        .then(res => res.data);
      }
    }    
  })
})

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
      id: { type: GraphQLString },
      firstName: { type: GraphQLString },
      age: { type: GraphQLInt },
      company: { 
        type: CompanyType,
        resolve(parentValue, args) {
          // console.log(parentValue, args);
          return axios.get(`http://localhost:3010/companies/${parentValue.companyId}`)
            .then(res => res.data);
        }
      }
  })
});

const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        // return _.find(users, { id: args.id }); 
        return axios.get(`http://localhost:3010/users/${args.id}`)
          // .then(response => console.log(response)) // {data: { firstName: 'bill' }} this is the response given by axios
          .then(resp => resp.data)
      }
    },
    company: {
      type: CompanyType,
      args: { id: { type: GraphQLString }},
      resolve(parentValue, args) {
        return axios.get(`http://localhost:3010/companies/${args.id}`)
        .then(resp => resp.data)
      }
    }
  }
});

// RootQuery Type -> UserType -> CompanyType
// At first our rootquery only has access to users, so we cannot query company directly

module.exports = new GraphQLSchema({
  query: RootQuery
});


// {
//   company(id: "1"){
//     id
//     name
//     description
//     users {
//       id
//       firstName
//       age
//       company{
//         name
//       }
//     }
//   }
// }