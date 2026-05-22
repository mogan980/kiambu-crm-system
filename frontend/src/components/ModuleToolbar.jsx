import React from 'react';

export default function ModuleToolbar({
  title,
  subtitle,
  search,
  setSearch,
  filter,
  setFilter,
  filters = ['All']
}) {
  return (
    <div className="table-toolbar">
      <div>
        <h3>{title}</h3>
        <p>{subtitle}</p>
      </div>

      <div className="toolbar-actions">
        <input
          className="search-input"
          placeholder="Search anything..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          {filters.map(item => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
