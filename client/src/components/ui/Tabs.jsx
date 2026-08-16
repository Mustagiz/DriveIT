import React from 'react';
import styles from './Tabs.module.css';

export const Tabs = ({ tabs, activeTab, onChange, variant = 'default', className = '' }) => {
  return (
    <div className={`${styles.tabsList} ${styles[variant]} ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon className={styles.tabIcon} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const TabsVertical = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`${styles.tabsList} ${styles.vertical} ${className}`}>
      {tabs.map((tab) => {
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => onChange(tab.id)}
          >
            {Icon && <Icon className={styles.tabIcon} />}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export const TabsPills = ({ tabs, activeTab, onChange, className = '' }) => {
  return (
    <div className={`${styles.tabsList} ${styles.pills} ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
