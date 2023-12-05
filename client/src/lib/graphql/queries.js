import { GraphQLClient, gql } from 'graphql-request'

const client = new GraphQLClient('http://localhost:9000/graphql')

export const getAllJobs = async () => {
  const query = gql`
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

  const data = await client.request(query)
  return data.jobs
}

export const getSingleJob = async (id) => {
  const query = gql`
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
  const data = await client.request(query, { id })
  return data.job
}

export const getCompanyById = async (id) => {
  const query = gql`
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
  const data = await client.request(query, { id })
  return data.company
}

export const createNewJob = async ({ title, description }) => {
  const mutation = gql`
    mutation createJob($input: CreateJobInput) {
      job: createJob(input: $input) {
        id
      }
    }
  `

  const data = await client.request(mutation, { input: { title, description } })
  return data.job
}
