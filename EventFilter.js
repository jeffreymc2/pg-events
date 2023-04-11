import React, { useState, useEffect } from 'react';
import supabase from './supabaseClient';
import './index.css'; // Make sure this line is added

const EventFilter = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [stateFilter, setStateFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [ballparkNameFilter, setBallparkNameFilter] = useState('');
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const perPage = 15;
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadEvents(page, true);
  }, [page]);

  const loadEvents = async (currentPage, reset) => {
    setIsLoading(true);

    if (reset) {
      setEvents([]);
    }

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
          setHasMore(data.length === perPage);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      }
    } catch (err) {
      console.error(err);
    }

    setIsLoading(false);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    setPage(page + 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    loadEvents(1, true);
  };

  return (
    <div className="bg-gray-100 p-8">
      <h1 className="text-2xl mb-6">Event Filter</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6"
        onSubmit={handleSubmit}
      >
        <label className="flex flex-col">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="mt-1 p-2 border border-gray-300 rounded"
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
        <button
          type="submit"
          className="col-span-1 md:col-span-2 lg:col-span-1 bg-blue-500 text-white py-2 px-4 rounded"
        >
          Filter Events
        </button>{' '}
      </form>
      <table className="w-full text-left border-collapse">
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
      {!isLoading && events.length === 0 && (
        <p>No events found with the current filters.</p>
      )}
      {isLoading && <p>Loading...</p>}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page <= 1}>
          Previous Page
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={!hasMore}>
          Next Page
        </button>
      </div>
    </div>
  );
};

export default EventFilter;
