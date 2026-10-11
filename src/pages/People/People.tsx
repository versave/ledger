import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
    Button,
    EditToggle,
    IconButton,
    Input,
    Note,
    Panel,
    Table,
    Td,
    Th,
} from '../../components';
import PageHeader from '../../layout/PageHeader/PageHeader';
import { newTempId, peopleService, type Person } from '../../services/people.service';

import styles from './People.module.scss';
import { NavLink } from 'react-router-dom';

export const People = () => {
    const [editing, setEditing] = useState(false);
    const [rows, setRows] = useState<Person[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    // The last state synced with the server; used to diff on save.
    const synced = useRef<Person[]>([]);

    useEffect(() => {
        peopleService
            .list()
            .then((data) => {
                setRows(data);
                synced.current = data;
            })
            .catch((e) => setError((e as Error).message));
    }, []);

    const update = (id: string, patch: Partial<Person>) => {
        setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    };

    const remove = (id: string) => {
        setRows((rs) => rs.filter((r) => r.id !== id));
    };

    const addRow = () => {
        setRows((rs) => [...rs, { id: newTempId(), name: '' }]);
    };

    // Edit locally; on leaving edit mode, persist and resync.
    const toggleEdit = async () => {
        if (!editing) {
            setEditing(true);
            return;
        }

        if (saving) {
            return;
        }

        setSaving(true);

        try {
            const fresh = await peopleService.save(synced.current, rows);
            setRows(fresh);
            synced.current = fresh;
            setError(null);
            setEditing(false);
        } catch (e) {
            setError((e as Error).message);
        } finally {
            setSaving(false);
        }
    };

    const canDelete = editing && rows.length > 1;

    return (
        <>
            <PageHeader
                title="People"
                desc="Everyone in this ledger. Each person gets their own Income page."
                actions={<EditToggle editing={editing} onToggle={toggleEdit} />}
            />

            {error && <Note>{error}</Note>}

            <Panel
                title="People"
                sub={`${rows.length} ${rows.length === 1 ? 'person' : 'people'}`}
                actions={
                    editing && (
                        <Button icon={<Plus size={14} strokeWidth={1.75} />} onClick={addRow}>
                            Add person
                        </Button>
                    )
                }
            >
                <Table minWidth={360}>
                    <thead>
                        <tr>
                            <Th>Name</Th>

                            <Th>Reference</Th>

                            {canDelete && <Th />}
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map((p) => (
                            <tr key={p.id}>
                                <Td>
                                    {editing ? (
                                        <Input
                                            value={p.name}
                                            placeholder="Name"
                                            aria-label="Person name"
                                            onChange={(e) => update(p.id, { name: e.target.value })}
                                        />
                                    ) : (
                                        <span className={styles.readText}>{p.name}</span>
                                    )}
                                </Td>

                                <Td>
                                    <NavLink to={`/income/${p.id}`} className={styles.readText}>
                                        Income
                                    </NavLink>
                                </Td>

                                {canDelete && (
                                    <Td>
                                        <IconButton
                                            icon={<X size={14} strokeWidth={1.5} />}
                                            label="Remove person"
                                            onClick={() => remove(p.id)}
                                        />
                                    </Td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Panel>
        </>
    );
};
