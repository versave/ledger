import { useState } from 'react'
import { EditToggle, EmptyState } from '../../components'
import PageHeader from '../../layout/PageHeader/PageHeader'
import type { PageDef } from '../../navigation'

export default function Placeholder({ page }: { page: PageDef }) {
  const [editing, setEditing] = useState(false)

  return (
    <>
      <PageHeader
        title={page.title}
        desc={page.desc}
        actions={page.editable && <EditToggle editing={editing} onToggle={() => setEditing(!editing)} />}
      />
      <EmptyState icon={page.icon} title="Coming soon" text="This page hasn't been built yet." />
    </>
  )
}
