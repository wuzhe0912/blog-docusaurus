import React from 'react';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import styles from './about.module.css';

function ProfileHeader() {
  return (
    <section className={styles.profileHeader}>
      <img
        className={styles.avatar}
        src="https://raw.githubusercontent.com/wuzhe0912/image-save/master/personal/me-2019-5-2.3u8s3z57t4g0.webp"
        alt="Pitt Wu"
      />
      <h1 className={styles.name}>Pitt Wu</h1>
      <p className={styles.role}>
        <Translate id="about.role">Software / Product Engineer</Translate>
      </p>
      <div className={styles.headerLinks}>
        <a
          href="https://github.com/wuzhe0912"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
        <span className={styles.divider}>/</span>
        <a
          href="https://linkedin.com/in/pitt-wu"
          target="_blank"
          rel="noopener noreferrer"
        >
          LinkedIn
        </a>
        <span className={styles.divider}>/</span>
        <a
          href="https://www.cakeresume.com/me/pittwu"
          target="_blank"
          rel="noopener noreferrer"
        >
          CakeResume
        </a>
      </div>
    </section>
  );
}

const expertiseAreas = [
  {
    titleId: 'about.expertise.vueNuxt.title',
    title: 'Vue / Nuxt 生態系',
    items: [
      { id: 'about.expertise.vueNuxt.item1', text: 'Vue 3 Composition API' },
      { id: 'about.expertise.vueNuxt.item2', text: 'Nuxt SSR / SSG' },
      { id: 'about.expertise.vueNuxt.item3', text: 'Hydration 機制' },
      { id: 'about.expertise.vueNuxt.item4', text: '生命週期管理' },
    ],
  },
  {
    titleId: 'about.expertise.frontend.title',
    title: '前端架構',
    items: [
      { id: 'about.expertise.frontend.item1', text: '狀態管理設計（Pinia）' },
      { id: 'about.expertise.frontend.item2', text: '元件通訊模式' },
      { id: 'about.expertise.frontend.item3', text: '專案架構規劃' },
      { id: 'about.expertise.frontend.item4', text: 'Bundler 配置與優化' },
    ],
  },
  {
    titleId: 'about.expertise.performance.title',
    title: '效能優化',
    items: [
      { id: 'about.expertise.performance.item1', text: 'Core Web Vitals' },
      { id: 'about.expertise.performance.item2', text: '圖片與資源最佳化' },
      { id: 'about.expertise.performance.item3', text: 'Virtual Scroll' },
      { id: 'about.expertise.performance.item4', text: 'Web Workers' },
    ],
  },
  {
    titleId: 'about.expertise.ai.title',
    title: 'AI 開發工作流',
    items: [
      { id: 'about.expertise.ai.item1', text: 'LLM 整合開發流程' },
      { id: 'about.expertise.ai.item2', text: 'AI-augmented 工程實踐' },
      { id: 'about.expertise.ai.item3', text: 'Prompt Engineering' },
      { id: 'about.expertise.ai.item4', text: '自動化工作流設計' },
    ],
  },
];

function ExpertiseSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>
          <Translate id="about.expertise.heading">Expertise</Translate>
        </h2>
        <div className={styles.expertiseGrid}>
          {expertiseAreas.map(({ titleId, title, items }) => (
            <div className={styles.expertiseCard} key={titleId}>
              <h3>
                <Translate id={titleId}>{title}</Translate>
              </h3>
              <ul>
                {items.map(({ id, text }) => (
                  <li key={id}>
                    <Translate id={id}>{text}</Translate>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const opportunities = [
  {
    id: 'about.workWithMe.opportunity1',
    text: '遠端 / 混合制的軟體工程師或產品工程師職位',
  },
  { id: 'about.workWithMe.opportunity2', text: 'Side Project 合作' },
  { id: 'about.workWithMe.opportunity3', text: '技術社群分享與交流' },
];

function WorkWithMe() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>
          <Translate id="about.workWithMe.heading">Work With Me</Translate>
        </h2>
        <div className={styles.prose}>
          <p>
            <Translate id="about.workWithMe.intro">
              我目前對以下機會保持開放：
            </Translate>
          </p>
          <ul className={styles.opportunities}>
            {opportunities.map(({ id, text }) => (
              <li key={id}>
                <Translate id={id}>{text}</Translate>
              </li>
            ))}
          </ul>
          <p>
            <Translate
              id="about.workWithMe.contact"
              values={{
                linkedinLink: (
                  <a
                    href="https://linkedin.com/in/pitt-wu"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                ),
              }}
            >
              {'如果你覺得我們可能有合作的空間，歡迎透過 {linkedinLink} 聯繫我。'}
            </Translate>
          </p>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <Layout
      title={translate({ id: 'about.meta.title', message: 'About' })}
      description={translate({
        id: 'about.meta.description',
        message: 'About Pitt Wu - Software / Product Engineer.',
      })}
    >
      <main className={styles.main}>
        <ProfileHeader />
        <ExpertiseSection />
        <WorkWithMe />
      </main>
    </Layout>
  );
}
