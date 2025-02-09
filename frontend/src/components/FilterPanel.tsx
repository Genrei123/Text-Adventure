import React, { useState } from 'react';

const FilterPanel: React.FC = () => {
  const [filters, setFilters] = useState({ status: 'all', tier: 'all', sortBy: 'createdAt', order: 'DESC' });

  return (
    <div className="filter-container">
      <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="offline">Offline</option>
      </select>
      <select onChange={(e) => setFilters({ ...filters, tier: e.target.value })}>
        <option value="all">All Tiers</option>
        <option value="free">Free</option>
        <option value="premium">Premium</option>
      </select>
      <select onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}>
        <option value="createdAt">Created At</option>
        <option value="username">Username</option>
      </select>
      <select onChange={(e) => setFilters({ ...filters, order: e.target.value })}>
        <option value="DESC">Descending</option>
        <option value="ASC">Ascending</option>
      </select>
    </div>
  );
};

export default FilterPanel;