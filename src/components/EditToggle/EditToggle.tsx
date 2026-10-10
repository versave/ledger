import { Check, Pencil } from 'lucide-react'
import Button from '../Button/Button'

interface Props {
  editing: boolean
  onToggle: () => void
}

/** Page-level Edit / Done switch shown in the page header. */
export default function EditToggle({ editing, onToggle }: Props) {
  const Icon = editing ? Check : Pencil
  return (
    <Button variant="toggle" active={editing} onClick={onToggle} icon={<Icon size={14} strokeWidth={1.75} />}>
      {editing ? 'Done' : 'Edit'}
    </Button>
  )
}
