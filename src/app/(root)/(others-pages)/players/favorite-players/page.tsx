import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import BasicFavoriteTable from '@/components/tables/BasicFavoriteTable'
import React from 'react'

const FavoritePlayers = () => {
  return (
    <div>
      <PageBreadcrumb pageTitle="Favori Oyuncular" />
      <div className="space-y-6">
          <BasicFavoriteTable />
      </div>
    </div>
  )
}

export default FavoritePlayers