// Single source of truth for domain enums shared by the client and the server.
// The DB CHECK constraints must use these exact string values
// (see server/db/migrations/*.sql — e.g. frequency IN ('Month', 'Year')).

export const FREQUENCIES = ['Month', 'Year'] as const
export type Frequency = (typeof FREQUENCIES)[number]
