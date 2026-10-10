import { Link2, Palette } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { PAGES } from '../../navigation'
import { cx } from '../../utils/cx'
import styles from './Sidebar.module.scss'

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <div className={styles.brandTile}>L</div>
        <div className={styles.brandName}>Ledger</div>
      </div>

      <nav className={styles.nav}>
        {PAGES.map(({ path, label, icon: Icon }) => (
          <NavLink key={path} to={path} className={({ isActive }) => cx(styles.navItem, isActive && styles.active)}>
            <Icon size={18} strokeWidth={1.5} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.foot}>
        <div className={styles.note}>
          <Link2 size={14} strokeWidth={1.5} />
          <span>Link any amount to a value elsewhere and it stays in sync. Saved in this browser.</span>
        </div>
        <NavLink
          to="/styleguide"
          className={({ isActive }) => cx(styles.devLink, isActive && styles.devLinkActive)}
        >
          <Palette size={13} strokeWidth={1.5} />
          Styleguide
        </NavLink>
      </div>
    </aside>
  )
}
