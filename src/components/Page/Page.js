import React from 'react'
import PullToRefresh from 'react-simple-pull-to-refresh'

export function Page({ id, children }) {
  return (
    <PullToRefresh onRefresh={() => window.location.reload()}>
      <main id={id} className="se-page">
        {children}
      </main>
    </PullToRefresh>
  )
}
