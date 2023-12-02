import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'
import { formatDate } from '../lib/formatters'
import { getSingleJob } from '../lib/graphql/queries'

function JobPage() {
  const [job, setJob] = useState()

  const { jobId } = useParams()

  useEffect(() => {
    getSingleJob(jobId).then((job) => setJob(job))
  }, [jobId])

  if (!job) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <h1 className='title is-2'>{job.title}</h1>
      <h2 className='subtitle is-4'>
        <Link to={`/companies/${job.company.id}`}>{job.company.name}</Link>
      </h2>
      <div className='box'>
        <div className='block has-text-grey'>
          Posted: {formatDate(job.date, 'long')}
        </div>
        <p className='block'>{job.description}</p>
      </div>
    </div>
  )
}

export default JobPage
