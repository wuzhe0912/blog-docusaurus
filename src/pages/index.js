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
  translate({ id: 'homepage.hero.title.1', message: 'Coding and Storytelling' }),
  translate({ id: 'homepage.hero.title.2', message: 'Weaving Code into Stories' }),
  translate({ id: 'homepage.hero.title.3', message: 'Lines of Code, Pages of Stories' }),
  translate({ id: 'homepage.hero.title.4', message: 'Where Technology Crafts Tales' }),
  translate({ id: 'homepage.hero.title.5', message: 'Conjuring Worlds with Keystrokes' }),
];

const subTitles = [
  translate({ id: 'homepage.hero.subtitle.1', message: 'Beat magic with magic' }),
  translate({ id: 'homepage.hero.subtitle.2', message: 'Coding Dreams into Reality' }),
  translate({ id: 'homepage.hero.subtitle.3', message: 'Spellbinding Code, Enchanting Stories' }),
  translate({ id: 'homepage.hero.subtitle.4', message: 'Debugging Life, One Story at a Time' }),
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
            <Translate id="homepage.hero.readBlog">閱讀文章</Translate>
          </Link>
          <Link
            className={clsx('button button--lg', styles.buttonOutline)}
            to="/about"
          >
            <Translate id="homepage.hero.aboutMe">關於我</Translate>
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
        <h2 className={styles.ctaTitle}>
          <Translate id="homepage.cta.title">Open to Opportunities</Translate>
        </h2>
        <p className={styles.ctaDesc}>
          <Translate id="homepage.cta.description">
            我目前對遠端工作、技術合作、或任何有趣的對話保持開放。
          </Translate>
        </p>
        <Link className={styles.ctaButton} to="/about">
          <Translate id="homepage.cta.learnMore">了解更多</Translate>
        </Link>
      </div>
    </section>
  );
}

export default function Home() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description={translate({
        id: 'homepage.meta.description',
        message:
          'Software / Product Engineer. Writing about engineering decisions, production lessons, and AI-augmented development.',
      })}
    >
      <HomepageHeader />
      <main>
        <HomepageFeatures />
        <ContactCTA />
      </main>
    </Layout>
  );
}
