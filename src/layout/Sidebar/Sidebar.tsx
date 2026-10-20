import {
    ArrowLeftRight,
    CreditCard,
    Landmark,
    Link2,
    type LucideIcon,
    Palette,
    User,
    Users,
    UsersRound,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cx } from '../../utils/cx';
import styles from './Sidebar.module.scss';
import { IncomePagesNavLinks } from '../IncomePagesNavLinks/IncomePagesNavLinks.tsx';
import { ExpensePagesNavLinks } from '../ExpensePagesNavLinks/ExpensePagesNavLinks.tsx';

const NavItem = ({ to, icon: Icon, label }: { to: string; icon: LucideIcon; label: string }) => (
    <NavLink to={to} className={({ isActive }) => cx(styles.navItem, isActive && styles.active)}>
        <Icon size={18} strokeWidth={1.5} />
        <span>{label}</span>
    </NavLink>
);

export default function Sidebar() {
    return (
        <aside className={styles.sidebar}>
            <div className={styles.brand}>
                <div className={styles.brandTile}>L</div>
                <div className={styles.brandName}>Ledger</div>
            </div>

            <nav className={styles.nav}>
                <NavItem to="/people" icon={UsersRound} label="People" />

                <IncomePagesNavLinks />

                <ExpensePagesNavLinks />

                <NavItem to="/personal" icon={User} label="Personal spread" />

                <NavItem to="/joint" icon={Users} label="Joint spread" />

                <NavItem to="/debt" icon={CreditCard} label="Debt" />

                <NavItem to="/transfers" icon={ArrowLeftRight} label="Monthly transfers" />

                <NavItem to="/nwr" icon={Landmark} label="Net worth review" />
            </nav>

            <div className={styles.foot}>
                <div className={styles.note}>
                    <Link2 size={14} strokeWidth={1.5} />
                    <span>
                        Link any amount to a value elsewhere and it stays in sync. Saved in this
                        browser.
                    </span>
                </div>
                <NavLink
                    to="/styleguide"
                    className={({ isActive }) =>
                        cx(styles.devLink, isActive && styles.devLinkActive)
                    }
                >
                    <Palette size={13} strokeWidth={1.5} />
                    Styleguide
                </NavLink>
            </div>
        </aside>
    );
}
