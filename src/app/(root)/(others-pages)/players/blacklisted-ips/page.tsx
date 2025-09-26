import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import BlacklistedIpsTable from '@/components/tables/BlacklistedIpsTable'
import React, { Suspense } from 'react'

const BlacklistedIpsPage = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Blacklisted IP's" />

      <Suspense fallback={<div>Loading tabs...</div>}>
        <BlacklistedIpsTable />
      </Suspense>
    </div>
  )
}

export default BlacklistedIpsPage