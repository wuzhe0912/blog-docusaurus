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
            to="/docs/interview-questions"
          >
            Get Started ⚡
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
