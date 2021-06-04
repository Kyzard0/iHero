import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { useLocation, useHistory } from "react-router-dom";

export const UpdateHero = () => {
  const initialHeroState = {
    id: null,
    name: "",
    rank: "",
    original_location: "",
    current_location: "",
    isActive: false,
  };
  let location = useLocation();
  const [currentHero, setCurrentHero] = useState(initialHeroState);
  const [submitted, setSubmitted] = useState(false);
  const countRef = useRef(0);
  const history = useHistory();

  useEffect(() => {
    retrieveHero();
  }, [countRef]);

  const retrieveHero = () => {
    axios
      .get(`/api/heroes/${location.state.id}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setCurrentHero({
          id: response.data.id,
          name: response.data.name,
          rank: response.data.rank,
          original_location: response.data.original_location,
          current_location: response.data.current_location,
          isActive: response.data.isActive,
        });
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const updateHero = () => {
    let data = {
      name: currentHero.name,
      rank: currentHero.rank,
      original_location: currentHero.original_location,
    };
    axios
      .put(`/api/heroes/${location.state.id}/`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setCurrentHero({
          id: response.data.id,
          name: response.data.name,
          rank: response.data.rank,
          original_location: response.data.original_location,
          current_location: response.data.current_location,
          isActive: response.data.isActive,
        });
        setSubmitted(true);
        console.log(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setCurrentHero({ ...currentHero, [name]: value });
  };

  const newHero = () => {
    setCurrentHero(initialHeroState);
    setSubmitted(false);
  };

  const handleBack = () => {
    history.push(`/heroes/`);
  }

  return (
    <div className="submit-form">
      {submitted ? (
        <div>
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            Hero Updated!
              <button
              type="button"
              className="close"
              data-dismiss="alert"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <button className="btn btn-success" onClick={newHero}>
            Update
            </button>
        </div>
      ) : (
        <div className='hero_card'>
          <h2>Edit Hero</h2>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder='Name'
              id="name"
              required
              value={currentHero.name}
              onChange={handleHeroChange}
              name="name"
            />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input
              type="text"
              className="form-control"
              placeholder='Ex: -53.2154,30.54846'
              id="location"
              required
              value={currentHero.location}
              onChange={handleHeroChange}
              name="location"
            />
          </div>
          <div className="form-group">
            <label htmlFor="rank">Rank:</label>
            <select
              type="text"
              className="form-control"
              placeholder='Rank'
              id="rank"
              required
              value={currentHero.rank}
              onChange={handleHeroChange}
              name="rank"
            >
              <option value="S">Rank S</option>
              <option value="A">Rank A</option>
              <option value="B">Rank B</option>
              <option value="C">Rank C</option>
            </select>
          </div>
          <br />
          <div>
            <button onClick={handleBack} className="btn button-form btn-danger">
              Back
              </button>
            <button onClick={updateHero} className="btn button-form btn-success">
              Submit
              </button>
          </div>
        </div>
      )}
    </div>
  );
};