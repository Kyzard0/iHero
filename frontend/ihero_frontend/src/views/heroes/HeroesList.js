import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useHistory, Link } from "react-router-dom";

export const HeroesList = () => {
  const [heroes, setHeroes] = useState([]);
  const history = useHistory();
  const countRef = useRef(0);

  useEffect(() => {
    retrieveAllHeroes();
  }, [countRef]);

  const retrieveAllHeroes = () => {
    axios
      .get(`/api/heroes/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setHeroes(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const deleteHero = (id) => {
    axios
      .delete(`/api/heroes/${id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        retrieveAllHeroes();
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleUpdateClick = (id) => {
    history.push(`/heroes/${id}/update/`, { id: id });
  };

  return (
    <div className="row justify-content-center">
      <h2>Heroes</h2>
      <div className='d-flex justify-content-end'>
        <Link to={`/heroes/add/`} className="btn btn-sm btn-success mb-2">Add Hero</Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Rank</th>
            <th>Location</th>
            <th style={{ width: '10%' }}></th>
          </tr>
        </thead>
        <tbody>
          {heroes && heroes.map(hero =>
            <tr key={hero.id}>
              <td>{hero.name}</td>
              <td>{hero.rank}</td>
              <td>{hero.original_location}</td>
              <td style={{ whiteSpace: 'nowrap' }}>
                <button onClick={() => handleUpdateClick(hero.id)} className="btn btn-sm btn-primary mr-1">Edit</button>
                <button onClick={() => deleteHero(hero.id)} className="btn btn-sm btn-danger btn-delete-user">
                  Delete
                </button>
              </td>
            </tr>
          )}
          {!heroes &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {heroes && !heroes.length &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">No Heroes To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};