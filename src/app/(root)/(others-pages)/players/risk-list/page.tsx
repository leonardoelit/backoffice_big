import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import BasicRiskTable from '@/components/tables/BasicRiskTable'
import React from 'react'

const RiskListPage
 = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Risk Listesi" />
      <div className="space-y-6">
          <BasicRiskTable />
      </div>
    </div>
  )
}

export default RiskListPage
