import { GraphQLError } from 'graphql'
import { getCompany } from './db/companies.js'
import {
  countJobs,
  createJob,
  deleteJob,
  getJob,
  getJobs,
  getJobsByCompany,
  updateJob,
} from './db/jobs.js'

export const resolvers = {
  Query: {
    jobs: async (_root, args) => {
      const { limit, offset } = args
      const items = await getJobs(limit, offset)
      const totalCount = await countJobs()
      return { items: items, totalCount: totalCount }
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
      const { user } = context
      //console.log(auth)

      if (!user) {
        throw unauthorizedError('Missing authentication')
      }

      const companyId = user.companyId

      const job = await createJob({ title, description, companyId })
      return job
    },

    deleteJob: async (_root, args, context) => {
      const { id } = args
      const { user } = context

      if (!user) {
        throw unauthorizedError('Missing authentication')
      }

      const job = await deleteJob(id, user.companyId)

      if (!job) {
        throw notFoundError('No job found with this id ' + id)
      }

      return job
    },

    updateJob: async (_root, args, context) => {
      const { id, title, description } = args.input
      const { user } = context

      if (!user) {
        throw unauthorizedError('Missing authentication')
      }

      const { companyId } = user

      const job = await updateJob({ id, companyId, title, description })

      if (!job) {
        throw notFoundError('No job found with this id ' + id)
      }

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
