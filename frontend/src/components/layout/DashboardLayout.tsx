import React from 'react';
import Sidebar from './Sidebar';
import TopNav from './TopNav';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
    children: React.ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
    return (
        <div className={styles.container}>
            <Sidebar />
            <main className={styles.main}>
                <TopNav />
                <div className={styles.content}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
