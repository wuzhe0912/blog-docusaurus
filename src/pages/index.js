import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '../components/HomepageFeatures';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Translate, { translate } from '@docusaurus/Translate';

const titles = [
  'Coding and Storytelling',
  'Weaving Code into Stories',
  'Lines of Code, Pages of Stories',
  'Where Technology Crafts Tales',
  'Conjuring Worlds with Keystrokes',
];

const subTitles = [
  'Beat magic with magic',
  'Coding Dreams into Reality',
  'Spellbinding Code, Enchanting Stories',
  'Debugging Life, One Story at a Time',
];

function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function HomepageHeader() {
  const [title, setTitle] = useState('');
  const [subTitle, setSubTitle] = useState('');

  useEffect(() => {
    setTitle(getRandomItem(titles));
    setSubTitle(getRandomItem(subTitles));
  }, []);

  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroProjectTagline}>
          <img
            className={styles.heroLogo}
            src={useBaseUrl('/img/docusaurus.svg')}
          />
          <span>{title}</span>
        </h1>
        <p className={styles.heroSubTitle}>{subTitle}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/blog"
          >
            閱讀文章
          </Link>
          <Link
            className={clsx('button button--lg', styles.buttonOutline)}
            to="/about"
          >
            關於我
          </Link>
        </div>
      </div>
    </header>
  );
}


function ContactCTA() {
  return (
    <section className={styles.cta}>
      <div className={styles.ctaContainer}>
        <h2 className={styles.ctaTitle}>Open to Opportunities</h2>
        <p className={styles.ctaDesc}>
          我目前對遠端工作、技術合作、或任何有趣的對話保持開放。
        </p>
        <div className={styles.ctaLinks}>
          <a
            href="https://github.com/wuzhe0912"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
          <a
            href="https://linkedin.com/in/pitt-wu"
            target="_blank"
            rel="noopener noreferrer"
          >
            LinkedIn
          </a>
          <a
            href="https://www.cakeresume.com/me/pittwu"
            target="_blank"
            rel="noopener noreferrer"
          >
            CakeResume
          </a>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Frontend Engineer specializing in Vue/Nuxt. Writing about engineering decisions, production lessons, and AI-augmented development."
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ContactCTA />
      </main>
    </Layout>
  );
}
