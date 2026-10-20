import { http } from './http';
import type { ExpenseBody, ResolvedAmount, ResolvedExpense } from '../../shared/expense';

// Re-export the shared contract so UI code can import it from the service.
export type { ExpenseBody, ResolvedExpense };

// New rows created in the UI get a temporary id until the server assigns a real one.
const TEMP_PREFIX = 'tmp-';
export const newTempId = () => TEMP_PREFIX + crypto.randomUUID();
const isTemp = (id: string) => id.startsWith(TEMP_PREFIX);

// Responses carry a resolved amount ({ ref, id, name, value }); convert back to the stored form.
const toBody = (e: ResolvedExpense): ExpenseBody => ({
    name: e.name,
    amount: toStoredAmount(e.amount),
});

const toStoredAmount = (amount: ResolvedAmount) =>
    typeof amount === 'number' ? amount : { ref: amount.ref };

export const ExpenseService = {
    list: () => http.get<ResolvedExpense[]>('/expenses'),
    create: (body: ExpenseBody) => http.post<ResolvedExpense>('/expenses', body),
    update: (id: string, body: ExpenseBody) => http.patch<ResolvedExpense>(`/expenses/${id}`, body),
    remove: (id: string) => http.delete(`/expenses/${id}`),

    // /** Persist edits since `original`: delete removed, create new (temp-id), replace the rest. */
    save: async (
        original: ResolvedExpense[],
        current: ResolvedExpense[],
    ): Promise<ResolvedExpense[]> => {
        const currentIds = new Set(current.map((e) => e.id));

        const deletes = original
            .filter((o) => !currentIds.has(o.id))
            .map((o) => ExpenseService.remove(o.id));

        const writes = current.map((e) =>
            isTemp(e.id)
                ? ExpenseService.create(toBody(e))
                : ExpenseService.update(e.id, toBody(e)),
        );

        await Promise.all([...deletes, ...writes]);
        return ExpenseService.list();
    },
};
