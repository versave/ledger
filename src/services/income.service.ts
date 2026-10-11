import type { Frequency } from '../../shared/enums';
import { http } from './http';

export interface Income {
    id: string;
    name: string;
    amountMonth: number;
    currency: string;
    frequency: Frequency;
    usage: string;
    holder: string | null; // people.id of the owner, or null
}

export type IncomeInput = Pick<Income, 'name' | 'amountMonth' | 'frequency' | 'usage' | 'holder'>;

// New rows created in the UI get a temporary id until the server assigns a real one.
const TEMP_PREFIX = 'tmp-';
export const newTempId = () => TEMP_PREFIX + crypto.randomUUID();
const isTemp = (id: string) => id.startsWith(TEMP_PREFIX);

const toInput = (r: Income): IncomeInput => ({
    name: r.name,
    amountMonth: r.amountMonth,
    frequency: r.frequency,
    usage: r.usage,
    holder: r.holder,
});

export const incomeService = {
    list: () => http.get<Income[]>('/income'),
    create: (input: IncomeInput) => http.post<Income>('/income', input),
    update: (id: string, patch: Partial<IncomeInput>) => http.patch<Income>(`/income/${id}`, patch),
    remove: (id: string) => http.delete(`/income/${id}`),
    save: async (original: Income[], current: Income[]): Promise<Income[]> => {
        const currentIds = new Set(current.map((r) => r.id));

        const deletes = original
            .filter((o) => !currentIds.has(o.id))
            .map((o) => incomeService.remove(o.id));

        const writes = current.map((r) =>
            isTemp(r.id)
                ? incomeService.create(toInput(r))
                : incomeService.update(r.id, toInput(r)),
        );

        await Promise.all([...deletes, ...writes]);

        return incomeService.list();
    },

    listByHolder: async (holder: string): Promise<Income[]> =>
        (await incomeService.list()).filter((r) => r.holder === holder),

    saveForHolder: async (
        holder: string,
        original: Income[],
        current: Income[],
    ): Promise<Income[]> => {
        const all = await incomeService.save(original, current);
        return all.filter((r) => r.holder === holder);
    },
};
