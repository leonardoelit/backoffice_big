import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import BasicTablePendingBonusRequests from '@/components/tables/BasicTablePendingBonusRequests'
import React from 'react'

const BonusRequests = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bonuslar Talepleri" />
      <div className="space-y-6">
          <BasicTablePendingBonusRequests />
      </div>
    </div>
  )
}

export default BonusRequests