import React, { useState, useEffect } from 'react'
import JobList from '../components/JobList'
import { getAllJobs } from '../lib/graphql/queries'

function HomePage() {
  const [jobData, setJobData] = useState([])

  useEffect(() => {
    getAllJobs().then((jobs) => setJobData(jobs))
  }, [])

  return (
    <div>
      <h1 className='title'>Job Board</h1>
      <JobList jobs={jobData} />
    </div>
  )
}

export default HomePage
