import { DefaultTemplate } from '@payloadcms/next/templates'
import type { AdminViewProps } from 'payload'
import React from 'react'

import { DashboardClient } from './DashboardClient'
import './dashboard.scss'

// Server component: DefaultTemplate requires a `payload` prop (ServerProps),
// which only server components receive via initPageResult.
export const Dashboard = ({ initPageResult, params, searchParams }: AdminViewProps) => {
  const { req, visibleEntities } = initPageResult

  return (
    <DefaultTemplate
      payload={req.payload}
      i18n={req.i18n}
      params={params}
      searchParams={searchParams}
      visibleEntities={visibleEntities}
    >
      <DashboardClient />
    </DefaultTemplate>
  )
}

export default Dashboard
