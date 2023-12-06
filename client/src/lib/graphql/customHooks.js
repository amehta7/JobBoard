import { useMutation, useQuery } from '@apollo/client'
import {
  allJobsQuery,
  companyByIdQuery,
  createJobMutation,
  singleJobQuery,
} from './queries'

export const useCompany = (id) => {
  const result = useQuery(companyByIdQuery, {
    variables: { id: id },
  })
  const { loading, data, error } = result

  return { company: data?.company, loading, error: Boolean(error) }
}

export const useSingleJob = (id) => {
  const result = useQuery(singleJobQuery, {
    variables: { id: id },
  })
  const { loading, data, error } = result

  return { job: data?.job, loading, error: Boolean(error) }
}

export const useAllJobs = () => {
  const result = useQuery(allJobsQuery, { fetchPolicy: 'network-only' })

  const { loading, data, error } = result

  return { jobs: data?.jobs, loading, error: Boolean(error) }
}

export const useCreateJob = () => {
  const [mutate, result] = useMutation(createJobMutation)

  const { loading } = result

  const createJob = async (title, description) => {
    const result = await mutate({
      variables: { input: { title, description } },
    })
    return result.data.job
  }

  return { createJob, loading }
}
