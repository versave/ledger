import type { ReactNode } from 'react';
import styles from './PageHeader.module.scss';

interface Props {
    title: string;
    desc?: string;
    /** Right side: Edit toggle, NWR year select + H1/H2… */
    actions?: ReactNode;
}

export default function PageHeader({ title, desc, actions }: Props) {
    return (
        <section className={styles.header}>
            <div className={styles.text}>
                <h1 className={styles.title}>{title}</h1>
                {desc && <p className={styles.desc}>{desc}</p>}
            </div>
            {actions && <div className={styles.actions}>{actions}</div>}
        </section>
    );
}
