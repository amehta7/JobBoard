import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { getCompanyById } from '../lib/graphql/queries'
import JobList from '../components/JobList'

function CompanyPage() {
  const [state, setState] = useState({
    loading: true,
    company: null,
    error: false,
  })

  const { companyId } = useParams()

  useEffect(() => {
    const getComapny = async () => {
      try {
        const company = await getCompanyById(companyId)
        setState({
          company: company,
          loading: false,
          error: false,
        })
      } catch (error) {
        setState({
          company: null,
          loading: false,
          error: true,
        })
      }
    }

    getComapny()
  }, [companyId])

  const { company, loading, error } = state

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div className='has-text-danger'>Data is not found</div>
  }

  return (
    <div>
      <h1 className='title'>{company.name}</h1>
      <div className='box'>{company.description}</div>
      <h2 className='title is-5'>Jobs at {company.name}</h2>

      <JobList jobs={company.jobs} />
    </div>
  )
}

export default CompanyPage
