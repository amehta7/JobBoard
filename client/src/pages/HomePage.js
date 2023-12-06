import React, { useState } from 'react'
import JobList from '../components/JobList'
import { useAllJobs } from '../lib/graphql/customHooks'
import PaginationBar from '../components/PaginationBar'

const JOBS_PER_PAGE = 10

function HomePage() {
  const [currentPage, setCurrentPage] = useState(1)

  const { jobs, loading, error } = useAllJobs(
    JOBS_PER_PAGE,
    (currentPage - 1) * JOBS_PER_PAGE
  )

  //console.log(jobs)

  const totalPages = Math.ceil(jobs?.totalCount / JOBS_PER_PAGE)

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className='has-text-danger'>Data is not found</div>
  }

  return (
    <div>
      <h1 className='title'>Job Board</h1>

      <PaginationBar
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
      <JobList jobs={jobs.items} />
    </div>
  )
}

export default HomePage

// const incPage = () => {
//   setCurrentPage((prev) => (prev === totalPages ? 1 : prev + 1))
// }

// const decPage = () => {
//   setCurrentPage((prev) => (prev === 1 ? totalPages : prev - 1))
// }

// <div>
//         <button disabled={currentPage === 1} onClick={decPage}>
//           Previous{' '}
//         </button>
//         <span onClick={(e) => setCurrentPage(e.target.value)}>
//           {`${currentPage} of ${totalPages}`}
//         </span>
//         <button disabled={currentPage === totalPages} onClick={incPage}>
//           Next
//         </button>
//       </div>
