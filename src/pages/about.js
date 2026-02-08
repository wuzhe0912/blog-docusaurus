import React from 'react';
import Layout from '@theme/Layout';
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
      <p className={styles.role}>Frontend Engineer</p>
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

function AboutSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>About</h2>
        <div className={styles.prose}>
          <p>
            我是一名前端工程師，在 Vue.js / Nuxt.js
            生態系有多年的深度開發經驗。從 SSR 架構設計、效能優化到狀態管理，
            我經手過不同規模的專案，也踩過不少坑。
          </p>
          <p>
            我相信好的工程師不只是會寫程式，更重要的是能在真實的限制條件下做出合理的決策——在時間壓力、技術債、團隊能力之間找到平衡點。
            這個網站記錄了我在這個過程中的思考，包括成功的選擇，也包括那些事後才發現走錯的路。
          </p>
          <p>
            工作之外，我是一個孩子的父親。我偏好遠端或混合制工作，相信好的產出不需要被辦公室的牆壁限制。
          </p>
        </div>
      </div>
    </section>
  );
}

const expertiseAreas = [
  {
    title: 'Vue / Nuxt 生態系',
    items: [
      'Vue 3 Composition API',
      'Nuxt SSR / SSG',
      'Hydration 機制',
      '生命週期管理',
    ],
  },
  {
    title: '前端架構',
    items: [
      '狀態管理設計（Pinia）',
      '元件通訊模式',
      '專案架構規劃',
      'Bundler 配置與優化',
    ],
  },
  {
    title: '效能優化',
    items: [
      'Core Web Vitals',
      '圖片與資源最佳化',
      'Virtual Scroll',
      'Web Workers',
    ],
  },
  {
    title: 'AI 開發工作流',
    items: [
      'LLM 整合開發流程',
      'AI-augmented 工程實踐',
      'Prompt Engineering',
      '自動化工作流設計',
    ],
  },
];

function ExpertiseSection() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Expertise</h2>
        <div className={styles.expertiseGrid}>
          {expertiseAreas.map(({ title, items }) => (
            <div className={styles.expertiseCard} key={title}>
              <h3>{title}</h3>
              <ul>
                {items.map((item) => (
                  <li key={item}>{item}</li>
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
  '遠端 / 混合制的前端或全端職位',
  '技術顧問與前端架構諮詢',
  'Side Project 合作',
  '技術社群分享與交流',
];

function WorkWithMe() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h2>Work With Me</h2>
        <div className={styles.prose}>
          <p>我目前對以下機會保持開放：</p>
          <ul className={styles.opportunities}>
            {opportunities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            如果你覺得我們可能有合作的空間，歡迎透過{' '}
            <a
              href="https://linkedin.com/in/pitt-wu"
              target="_blank"
              rel="noopener noreferrer"
            >
              LinkedIn
            </a>{' '}
            聯繫我。
          </p>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <Layout
      title="About"
      description="About Pitt Wu - Frontend Engineer specializing in Vue/Nuxt ecosystem."
    >
      <main className={styles.main}>
        <ProfileHeader />
        <AboutSection />
        <ExpertiseSection />
        <WorkWithMe />
      </main>
    </Layout>
  );
}
