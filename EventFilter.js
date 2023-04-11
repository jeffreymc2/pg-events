// EventFilter.js

import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import './EventFilter.css';

const EventFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [ballparkNameFilter, setBallparkNameFilter] = useState('');
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    const fetchEvents = async () => {
      await handleSubmit(null, page);
    };

    fetchEvents();
  }, [page]);

  const handleSubmit = async (e, currentPage) => {
    if (e) {
      e.preventDefault();
    }
    setEvents([]);

    const filters = supabase
      .from('totalevents')
      .select('*')
      .gte('eventstartdate', startDate)
      .lte('eventenddate', endDate);

    if (stateFilter) {
      filters.ilike('state', stateFilter);
    }

    if (cityFilter) {
      filters.ilike('city', cityFilter);
    }

    if (ballparkNameFilter) {
      filters.ilike('ballparkname', ballparkNameFilter);
    }

    filters.range((currentPage - 1) * perPage, currentPage * perPage - 1);

    try {
      const { data, error } = await filters;

      if (error) {
        console.error(error);
      } else {
        if (Array.isArray(data)) {
          setEvents(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  return (
    <div className="event-filter-container">
      <h1>Event Filter</h1>
      <form
        className="event-filter-form"
        onSubmit={(e) => {
          handleSubmit(e, page);
        }}
      >
        <label>
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </label>
        <label>
          End Date:
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </label>
        <label>
          State:
          <input
            type="text"
            value={stateFilter}
            onChange={(e) => setStateFilter(e.target.value)}
          />
        </label>
        <label>
          City:
          <input
            type="text"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          />
        </label>
        <label>
          Ballpark Name:
          <input
            type="text"
            value={ballparkNameFilter}
            onChange={(e) => setBallparkNameFilter(e.target.value)}
          />
        </label>
        <button type="submit">Filter Events</button>
      </form>
      <table className="event-filter-table">
        <thead>
          <tr>
            <th>Event Name</th>
            <th>Event Start Date</th>
            <th>Event End Date</th>
            <th>Ballpark Name</th>
            <th>City</th>
            <th>State</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.eventname}>
              <td>{event.eventname}</td>
              <td>{event.eventstartdate}</td>
              <td>{event.eventenddate}</td>
              <td>{event.ballparkname}</td>
              <td>{event.city}</td>
              <td>{event.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
};

export default EventFilter;

