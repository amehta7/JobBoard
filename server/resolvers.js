import { getCompany } from './db/companies.js'
import { getJobs } from './db/jobs.js'

export const resolvers = {
  Query: {
    jobs: async () => {
      const jobs = await getJobs()
      return jobs
    },
  },

  Job: {
    date: (job) => job.createdAt.slice(0, 'yyyy-mm-dd'.length),
    company: async (job) => await getCompany(job.companyId),
  },
}
