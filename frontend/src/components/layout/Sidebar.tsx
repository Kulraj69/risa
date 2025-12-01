import React from 'react';
import styles from './Sidebar.module.css';
import {
    IconHome,
    IconCases,
    IconTasks,
    IconLetters,
    IconRules,
    IconIntegrations,
    IconSettings
} from '../ui/Icons';

const Sidebar = () => {
    const navItems = [
        { label: 'Home', icon: IconHome, active: false },
        { label: 'Cases', icon: IconCases, active: true },
        { label: 'Tasks', icon: IconTasks, active: false },
        { label: 'Letters', icon: IconLetters, active: false },
        { label: 'Rules', icon: IconRules, active: false },
        { label: 'Integrations', icon: IconIntegrations, active: false },
        { label: 'Settings', icon: IconSettings, active: false },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div style={{ width: 24, height: 24, background: 'var(--accent-primary)', borderRadius: 6 }}></div>
                Mini-RISA
            </div>
            <nav className={styles.nav}>
                {navItems.map((item) => (
                    <div
                        key={item.label}
                        className={`${styles.navItem} ${item.active ? styles.active : ''}`}
                    >
                        <item.icon size={18} />
                        {item.label}
                    </div>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;
