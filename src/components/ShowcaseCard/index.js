import React, { useState, useRef, useEffect } from 'react';
import Translate from '@docusaurus/Translate';
import { tags as tagDefinitions } from '../../data/projects';
import styles from './styles.module.css';

function SourceButton({ source }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (typeof source === 'string') {
    return (
      <a
        href={source}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkButton}
      >
        <Translate id="projects.card.source">Source</Translate>
      </a>
    );
  }

  const entries = Object.entries(source);
  return (
    <div className={styles.sourceDropdown} ref={ref}>
      <button
        className={styles.sourceToggle}
        onClick={() => setOpen((v) => !v)}
        type="button"
      >
        <Translate id="projects.card.source">Source</Translate>
        <span aria-hidden="true">&#9662;</span>
      </button>
      {open && (
        <div className={styles.sourceMenu}>
          {entries.map(([label, url]) => (
            <a
              key={label}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sourceMenuItem}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShowcaseCard({ project }) {
  const { title, description, preview, website, source, tags } = project;

  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={preview} alt={title} className={styles.image} loading="lazy" />
      </div>
      <div className={styles.body}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <div className={styles.links}>
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.linkButton}
              >
                <Translate id="projects.card.website">Website</Translate>
              </a>
            )}
            {source && <SourceButton source={source} />}
          </div>
        </div>
        <p className={styles.description}>{description}</p>
        <div className={styles.tags}>
          {tags.map((tagKey) => {
            const tagDef = tagDefinitions[tagKey];
            if (!tagDef) return null;
            return (
              <span key={tagKey} className={styles.tag}>
                <span
                  className={styles.tagDot}
                  style={{ backgroundColor: tagDef.color }}
                />
                {tagDef.label}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
