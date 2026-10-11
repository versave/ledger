import { http } from './http';

export interface Person {
    id: string;
    name: string;
}

export type PersonInput = Pick<Person, 'name'>;

// New rows created in the UI get a temporary id until the server assigns a real one.
const TEMP_PREFIX = 'tmp-';
export const newTempId = () => TEMP_PREFIX + crypto.randomUUID();
const isTemp = (id: string) => id.startsWith(TEMP_PREFIX);

const toInput = (p: Person): PersonInput => ({ name: p.name });

export const peopleService = {
    list: () => http.get<Person[]>('/people'),
    create: (input: PersonInput) => http.post<Person>('/people', input),
    update: (id: string, patch: Partial<PersonInput>) => http.patch<Person>(`/people/${id}`, patch),
    remove: (id: string) => http.delete(`/people/${id}`),

    /** Persist edits since `original`: delete removed, create new (temp-id), replace the rest. */
    save: async (original: Person[], current: Person[]): Promise<Person[]> => {
        const currentIds = new Set(current.map((p) => p.id));

        const deletes = original
            .filter((o) => !currentIds.has(o.id))
            .map((o) => peopleService.remove(o.id));

        const writes = current.map((p) =>
            isTemp(p.id)
                ? peopleService.create(toInput(p))
                : peopleService.update(p.id, toInput(p)),
        );

        await Promise.all([...deletes, ...writes]);
        return peopleService.list();
    },
};
