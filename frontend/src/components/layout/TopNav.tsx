import React from 'react';
import styles from './TopNav.module.css';
import { IconSearch, IconBell } from '../ui/Icons';

const TopNav = () => {
    return (
        <header className={styles.topNav}>
            <div className={styles.searchContainer}>
                <IconSearch size={16} className="text-tertiary" />
                <input
                    type="text"
                    placeholder="Search cases, patients, or policies..."
                    className={styles.searchInput}
                />
            </div>

            <div className={styles.actions}>
                <button className={styles.iconBtn}>
                    <IconBell size={20} />
                </button>
                <div className={styles.avatar}>
                    JD
                </div>
            </div>
        </header>
    );
};

export default TopNav;
