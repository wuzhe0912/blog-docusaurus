import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';

const FeatureList = [
  {
    title: '技術開發',
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: <>紀錄自己的學習筆記，並透過分享的形式重新審視。</>,
  },
  {
    title: '個人成長',
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: <>簡單分享自己的生活點滴，記錄閱讀與生活探索。</>,
  },
  {
    title: 'AI 應用',
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: <>逐步研究使用 AI 來進行自動化應用，並嘗試尋找落地可行性。</>,
  },
];

function Feature({ Svg, title, description }) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} alt={title} />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
