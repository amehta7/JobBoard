import { GraphQLError } from 'graphql'
import { getCompany } from './db/companies.js'
import { getJob, getJobs, getJobsByCompany } from './db/jobs.js'

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
