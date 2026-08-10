import React from 'react';
import Link from '@docusaurus/Link';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

const GAME_URL = 'https://whisper-isle.zeabur.app/';

export default function WhisperIslePromo() {
  return (
    <section className={styles.promo} aria-labelledby="whisper-isle-heading">
      <div className={styles.overlay} />
      <div className={styles.inner}>
        <p className={styles.eyebrow}>
          <Translate id="homepage.whisperIsle.eyebrow">
            An Isometric Browser MMO
          </Translate>
        </p>
        <h2 className={styles.title} id="whisper-isle-heading">
          Whisper Isle
        </h2>
        <p className={styles.tagline}>
          <Translate id="homepage.whisperIsle.tagline">
            The wind remembers every arrival
          </Translate>
        </p>
        <p className={styles.description}>
          <Translate id="homepage.whisperIsle.description">
            A real-time multiplayer game I built end to end — client, server,
            and world tooling. No download: open a browser and you are on the
            isle.
          </Translate>
        </p>
        <div className={styles.actions}>
          <a
            className={styles.playButton}
            href={GAME_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Translate id="homepage.whisperIsle.play">
              Play in your browser
            </Translate>
            <span className={styles.arrow} aria-hidden="true">
              &rarr;
            </span>
          </a>
          <Link className={styles.secondaryLink} to="/projects">
            <Translate id="homepage.whisperIsle.details">
              See the project
            </Translate>
          </Link>
        </div>
      </div>
    </section>
  );
}
