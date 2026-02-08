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
        <p className={styles.heroIntro}>Pitt Wu / Frontend Engineer</p>
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

const pillars = [
  {
    title: 'Vue / Nuxt 深度實戰',
    description:
      '不是教你 API 怎麼用，而是分享真實專案中 SSR 架構的取捨、Hydration 的踩坑、狀態管理的遷移決策。',
  },
  {
    title: '效能優化實錄',
    description:
      '從 Core Web Vitals 到 Bundle 瘦身，記錄每次效能優化的完整過程：問題發現、分析思路、解決方案、最終數據。',
  },
  {
    title: 'AI 時代的工程師',
    description:
      '探索如何將 AI 工具融入工程工作流，在模型能力快速進化的時代，重新定義工程師的價值。',
  },
];

function Pillars() {
  return (
    <section className={styles.pillars}>
      <div className={styles.pillarsContainer}>
        <h2 className={styles.pillarsTitle}>我寫什麼</h2>
        <div className={styles.pillarGrid}>
          {pillars.map(({ title, description }) => (
            <div className={styles.pillar} key={title}>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
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
        <Pillars />
        <HomepageFeatures />
        <ContactCTA />
      </main>
    </Layout>
  );
}
