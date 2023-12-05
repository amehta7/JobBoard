import { GraphQLError } from 'graphql'
import { getCompany } from './db/companies.js'
import {
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from './db/jobs.js'

export const resolvers = {
  Query: {
    jobs: async () => {
      const jobs = await getJobs()
      return jobs
    },
    job: async (_root, args) => {
      const job = await getJob(args.id)

      if (!job) {
        throw notFoundError('No job found with this id ' + args.id)
      }

      return job
    },
    company: async (_root, args) => {
      const company = await getCompany(args.id)

      if (!company) {
        throw notFoundError('No company found with this id ' + args.id)
      }

      return company
    },
  },

  Mutation: {
    createJob: async (_root, args, context) => {
      const { title, description } = args.input
      const { auth } = context

      if (!auth) {
        throw unauthorizedError('Missing authentication')
      }

      const companyId = 'Gu7QW9LcnF5d'
      const job = await createJob({ title, description, companyId })
      return job
    },

    deleteJob: async (_root, args) => {
      const { id } = args
      const job = await deleteJob(id)
      return job
    },
    updateJob: async (_root, args) => {
      const { id, title, description } = args.input
      const job = await updateJob({ id, title, description })
      return job
    },
  },

  Job: {
    date: (job) => job.createdAt.slice(0, 'yyyy-mm-dd'.length),
    company: async (job) => await getCompany(job.companyId),
  },

  Company: {
    jobs: async (company) => await getJobsByCompany(company.id),
  },
}

const notFoundError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: 'NOT_FOUND' },
  })
}

const unauthorizedError = (message) => {
  return new GraphQLError(message, {
    extensions: { code: 'UNAUTHORIZED' },
  })
}
