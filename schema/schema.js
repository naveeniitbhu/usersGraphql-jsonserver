const graphql = require('graphql');
// const _ = require('lodash');
const axios = require('axios');

const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema, //takes a rootquery and returns a graphqlschema instance
  GraphQLList,
  GraphQLNonNull,
} = graphql;

// const users = [
//   { id: '23', firstName: 'Bill', age:20 },
//   { id: '47', firstName: 'Samantha', age:21 }
// ];

// CompanyType and UserType circular referernce error
// Use arrow functions to avoid this since the functions get defined but is executed
// only when the whole file is executed. 
// we treat associations between types i.e. CompanyType and UserType as just
// another field. 

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  //always use arrow functions here
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
        // resolve resolves the diff between the incoming model and data type
        resolve(parentValue, args) {
          // console.log(parentValue, args);
          // parentValue is the value we fetched i.e. users in this case
          return axios.get(`http://localhost:3010/companies/${parentValue.companyId}`)
            .then(res => res.data);
        }
      }
  })
});

// This tells I am looking for users which is a Usertype and given id

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

const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    //Here, we are returning the same type but sometimes it can be different
    addUser: {
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        age: { type: new GraphQLNonNull(GraphQLInt)},
        companyId: { type: GraphQLString}
      },
      resolve(parentValue, { firstName, age }){
        return axios.post('http://localhost:3010/users', { firstName, age})
        .then(res => res.data)

      }
    },
    deleteUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, { id }){
        return axios.delete(`http://localhost:3010/users/${id}`)
        .then(res => res.data);

      }
    },
    editUser: {
      type: UserType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString)},
        firstName: { type: GraphQLString },
        age: { type: GraphQLInt},
        companyId: { type: GraphQLString}
      },
      resolve(parentValue, args){
        return axios.patch(`http://localhost:3010/users/${args.id}`, args)
        .then(res => res.data)

      }
    },
  }
})

// mutation {
//   addUser(firstName: "fdsas",age:26){
//     id
//     firstName
//     age
//   }
// }
// graphql always return something even if it deleted.

module.exports = new GraphQLSchema({
  query: RootQuery,
  // mutation: mutation,
  mutation
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

// Below default variables are declared. We cam also mandatory variables by using ! at the end of Episode

// query HeroNameAndFriends($episode: Episode = JEDI) {
//   hero(episode: $episode) {
//     name
//     friends {
//       name
//     }
//   }
// }

// Directives can be useful to get out of situations where you otherwise would need to do string manipulation to add and remove fields in your query

// query Hero($episode: Episode, $withFriends: Boolean!) {
//   hero(episode: $episode) {
//     name
//     friends @include(if: $withFriends) {
//       name
//     }
//   }
// }
// {
//   "episode": "JEDI",
//   "withFriends": true
// }

// we can mutate and query the new value of the field with one request.

