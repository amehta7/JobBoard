import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  gql,
  concat,
} from '@apollo/client'
//import { GraphQLClient } from 'graphql-request'
import { getAccessToken } from '../auth'

// const client = new GraphQLClient('http://localhost:9000/graphql', {
//   headers: () => {
//     const token = getAccessToken()

//     if (token) {
//       return { Authorization: `Bearer ${token}` }
//     }

//     return {}
//   },
// })

const httpLink = createHttpLink({ uri: 'http://localhost:9000/graphql' })

const authLink = new ApolloLink((operation, forward) => {
  const token = getAccessToken()

  if (token) {
    operation.setContext({
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  }

  return forward(operation)
})

export const apolloClient = new ApolloClient({
  link: concat(authLink, httpLink),
  cache: new InMemoryCache(),
  // defaultOptions: {
  //   query: {
  //     fetchPolicy: 'network-only',
  //   },
  //   watchQuery: {
  //     fetchPolicy: 'network-only',
  //   },
  // },
})

export const companyByIdQuery = gql`
  query CompanyById($id: ID!) {
    company(id: $id) {
      id
      name
      description
      jobs {
        id
        title
        date
      }
    }
  }
`

export const allJobsQuery = gql`
  query Jobs {
    jobs {
      id
      title
      date
      company {
        id
        name
      }
    }
  }
`

export const singleJobQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      id
      title
      date
      company {
        id
        name
      }
      description
    }
  }
`

export const createJobMutation = gql`
  mutation createJob($input: CreateJobInput!) {
    job: createJob(input: $input) {
      id
    }
  }
`

// export const createNewJob = async ({ title, description }) => {
//   const mutation = gql`
//     mutation createJob($input: CreateJobInput!) {
//       job: createJob(input: $input) {
//         id
//       }
//     }
//   `

//   // const data = await client.request(mutation, { input: { title, description } })
//   const result = await apolloClient.mutate({
//     mutation,
//     variables: { input: { title, description } },
//   })

//   //return data.job
//   return result.data.job
// }

// export const getAllJobs = async () => {
//   const query = gql`
//     query Jobs {
//       jobs {
//         id
//         title
//         date
//         company {
//           id
//           name
//         }
//       }
//     }
//   `

//   // const data = await client.request(query)
//   const result = await apolloClient.query({
//     query,
//     fetchPolicy: 'network-only',
//   })

//   //return data.jobs
//   return result.data.jobs
// }

// export const getSingleJob = async (id) => {
//   const query = gql`
//     query JobById($id: ID!) {
//       job(id: $id) {
//         id
//         title
//         date
//         company {
//           id
//           name
//         }
//         description
//       }
//     }
//   `
//   //const data = await client.request(query, { id })
//   const result = await apolloClient.query({ query, variables: { id } })

//   //return data.job
//   return result.data.job
// }

// export const getCompanyById = async (id) => {
//   const query = gql`
//     query CompanyById($id: ID!) {
//       company(id: $id) {
//         id
//         name
//         description
//         jobs {
//           id
//           title
//           date
//         }
//       }
//     }
//   `
//   //const data = await client.request(query, { id })
//   const result = await apolloClient.query({ query, variables: { id } })
//   //return data.company
//   return result.data.company
// }
