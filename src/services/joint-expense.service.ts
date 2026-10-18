import { http } from './http';
import type { JointExpenseBody, ResolvedAmount, ResolvedJointExpense } from '../../shared/expense';

// Re-export the shared contract so UI code can import it from the service.
export type { JointExpenseBody, ResolvedJointExpense };

// New rows created in the UI get a temporary id until the server assigns a real one.
const TEMP_PREFIX = 'tmp-';
export const newTempId = () => TEMP_PREFIX + crypto.randomUUID();
const isTemp = (id: string) => id.startsWith(TEMP_PREFIX);

// Responses carry a resolved amount ({ ref, id, name, value }); convert back to the stored form.
const toBody = (e: ResolvedJointExpense): JointExpenseBody => ({
    name: e.name,
    amount: toStoredAmount(e.amount),
    split: e.split,
});

const toStoredAmount = (amount: ResolvedAmount) =>
    typeof amount === 'number' ? amount : { ref: amount.ref };

export const jointExpenseService = {
    list: () => http.get<ResolvedJointExpense[]>('/joint-expenses'),
    create: (body: JointExpenseBody) => http.post<ResolvedJointExpense>('/joint-expenses', body),
    update: (id: string, body: JointExpenseBody) =>
        http.patch<ResolvedJointExpense>(`/joint-expenses/${id}`, body),
    remove: (id: string) => http.delete(`/joint-expenses/${id}`),

    /** Persist edits since `original`: delete removed, create new (temp-id), replace the rest. */
    save: async (
        original: ResolvedJointExpense[],
        current: ResolvedJointExpense[],
    ): Promise<ResolvedJointExpense[]> => {
        const currentIds = new Set(current.map((e) => e.id));

        const deletes = original
            .filter((o) => !currentIds.has(o.id))
            .map((o) => jointExpenseService.remove(o.id));

        const writes = current.map((e) =>
            isTemp(e.id)
                ? jointExpenseService.create(toBody(e))
                : jointExpenseService.update(e.id, toBody(e)),
        );

        await Promise.all([...deletes, ...writes]);
        return jointExpenseService.list();
    },
};
