import type { ReactNode } from 'react'
import Sidebar from '../Sidebar/Sidebar'
import styles from './Shell.module.scss'

export const Shell = ({ children }: { children: ReactNode }) => {
    return (
        <div className={styles.shell}>
            <Sidebar />

            <main className={styles.main}>{children}</main>
        </div>
    )
}
