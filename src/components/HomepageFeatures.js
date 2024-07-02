import React from 'react';
import clsx from 'clsx';
import styles from './HomepageFeatures.module.css';
import Translate from '@docusaurus/Translate';

const FeatureList = [
  {
    title: (
      <Translate id="homepage.features.fairWorld.title">公平世界</Translate>
    ),
    Svg: require('../../static/img/undraw_docusaurus_mountain.svg').default,
    description: (
      <Translate id="homepage.features.fairWorld.description">
        錢流向了不缺錢的人，愛流向了不缺愛的人，苦流向了最能吃苦的人。
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.lifeJourney.title">人生迷途</Translate>
    ),
    Svg: require('../../static/img/undraw_docusaurus_tree.svg').default,
    description: (
      <Translate id="homepage.features.lifeJourney.description">
        人生最大的樂趣就是像無頭蒼蠅一樣亂撞，並慶祝那些意外地轉折與突如其來的災難，還有什麼比徹底迷失方向更能證明你活著呢？
      </Translate>
    ),
  },
  {
    title: (
      <Translate id="homepage.features.dreamReality.title">夢想現實</Translate>
    ),
    Svg: require('../../static/img/undraw_docusaurus_react.svg').default,
    description: (
      <Translate id="homepage.features.dreamReality.description">
        當你還年輕時，不要覺得自己人生就這樣了，等到你年紀更大一些，就會發現要保持這樣都沒這麼容易。
      </Translate>
    ),
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
