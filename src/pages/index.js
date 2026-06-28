import React from 'react';
import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title="Documentation" description="Range42 — Open-Source Cyber Range Platform documentation">
      <main className={styles.hero}>
        <h1 className={styles.title}>{siteConfig.title}</h1>
        <p className={styles.tagline}>{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--primary button--lg" to="/docs/">Read the docs</Link>
          <Link className="button button--secondary button--lg" to="https://range42.lu">range42.lu</Link>
        </div>
      </main>
    </Layout>
  );
}
