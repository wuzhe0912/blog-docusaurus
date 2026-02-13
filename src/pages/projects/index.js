import React, { useState, useMemo } from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Translate, { translate } from '@docusaurus/Translate';
import ShowcaseCard from '../../components/ShowcaseCard';
import { projects, tags as tagDefinitions } from '../../data/projects';
import styles from './index.module.css';

function ShowcaseHeader() {
  return (
    <div className={styles.header}>
      <h1 className={styles.title}>
        <Translate id="projects.title">Projects</Translate>
      </h1>
      <p className={styles.subtitle}>
        <Translate id="projects.description">
          Side projects and open-source work I've built or contributed to.
        </Translate>
      </p>
    </div>
  );
}

function ShowcaseFilters({ selectedTags, toggleTag, searchQuery, setSearchQuery, filteredCount, totalCount }) {
  const hasFilters = selectedTags.length > 0 || searchQuery.length > 0;

  return (
    <div className={styles.filters}>
      <div className={styles.filterRow}>
        {Object.entries(tagDefinitions).map(([key, { label, color }]) => (
          <button
            key={key}
            className={clsx(styles.tagChip, selectedTags.includes(key) && styles.tagChipActive)}
            onClick={() => toggleTag(key)}
            type="button"
          >
            <span className={styles.tagDot} style={{ backgroundColor: color }} />
            {label}
          </button>
        ))}
      </div>
      <div className={styles.searchRow}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder={translate({
            id: 'projects.search.placeholder',
            message: 'Search projects...',
          })}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <span className={styles.filterMeta}>
          <Translate
            id="projects.filters.count"
            values={{ filtered: filteredCount, total: totalCount }}
          >
            {'{filtered} of {total} projects'}
          </Translate>
          {hasFilters && (
            <button
              className={styles.clearButton}
              onClick={() => {
                toggleTag(null);
                setSearchQuery('');
              }}
              type="button"
            >
              <Translate id="projects.filters.clearAll">Clear All</Translate>
            </button>
          )}
        </span>
      </div>
    </div>
  );
}

export default function Projects() {
  const [selectedTags, setSelectedTags] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  function toggleTag(tag) {
    if (tag === null) {
      setSelectedTags([]);
      return;
    }
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  }

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesTags =
        selectedTags.length === 0 ||
        selectedTags.every((tag) => project.tags.includes(tag));
      const matchesSearch =
        searchQuery.length === 0 ||
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        project.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesTags && matchesSearch;
    });
  }, [selectedTags, searchQuery]);

  return (
    <Layout
      title={translate({ id: 'projects.title', message: 'Projects' })}
      description={translate({
        id: 'projects.description',
        message: "Side projects and open-source work I've built or contributed to.",
      })}
    >
      <main className={styles.main}>
        <ShowcaseHeader />
        <ShowcaseFilters
          selectedTags={selectedTags}
          toggleTag={toggleTag}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredCount={filteredProjects.length}
          totalCount={projects.length}
        />
        {filteredProjects.length > 0 ? (
          <div className={styles.grid}>
            {filteredProjects.map((project) => (
              <ShowcaseCard key={project.title} project={project} />
            ))}
          </div>
        ) : (
          <p className={styles.noResults}>
            <Translate id="projects.noResults">No projects match your filters.</Translate>
          </p>
        )}
      </main>
    </Layout>
  );
}
