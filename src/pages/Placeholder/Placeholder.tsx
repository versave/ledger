import { useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { EditToggle, EmptyState } from '../../components';
import PageHeader from '../../layout/PageHeader/PageHeader';

interface Props {
    title: string;
    desc: string;
    icon: LucideIcon;
    editable?: boolean;
}

export default function Placeholder({ title, desc, icon, editable = false }: Props) {
    const [editing, setEditing] = useState(false);

    return (
        <>
            <PageHeader
                title={title}
                desc={desc}
                actions={
                    editable && (
                        <EditToggle editing={editing} onToggle={() => setEditing(!editing)} />
                    )
                }
            />
            <EmptyState icon={icon} title="Coming soon" text="This page hasn't been built yet." />
        </>
    );
}
