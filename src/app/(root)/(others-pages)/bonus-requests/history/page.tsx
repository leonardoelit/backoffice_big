import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import BasicTableBonusRequests from '@/components/tables/BasicTableBonusRequests'
import React from 'react'

const BonusRequestsHistory = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Bonuslar Talepleri" />
      <div className="space-y-6">
          <BasicTableBonusRequests />
      </div>
    </div>
  )
}

export default BonusRequestsHistory