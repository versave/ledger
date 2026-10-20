import { PropsWithChildren } from 'react';

export const ContentContainer = ({ children }: PropsWithChildren) => {
    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--gap)',
            }}
        >
            {children}
        </div>
    );
};
