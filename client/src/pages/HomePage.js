import React from 'react'
import JobList from '../components/JobList'
import { useAllJobs } from '../lib/graphql/customHooks'

function HomePage() {
  const { jobs, loading, error } = useAllJobs()

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className='has-text-danger'>Data is not found</div>
  }

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <JobList jobs={jobs} />
    </div>
  )
}

export default HomePage
