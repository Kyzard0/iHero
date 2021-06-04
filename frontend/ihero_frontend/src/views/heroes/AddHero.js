import axios from "axios";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export const AddHero = () => {
  const initialHeroState = {
    id: null,
    name: "",
    rank: "",
    location: "",
    isActive: false,
    error: ''
  };
  const [hero, setHero] = useState(initialHeroState);
  const [submitted, setSubmitted] = useState(false);
  const history = useHistory();

  const handleHeroChange = (e) => {
    const { name, value } = e.target;
    setHero({ ...hero, [name]: value });
  };

  const submitHero = () => {
    let data = {
      name: hero.name,
      rank: hero.rank,
      original_location: hero.location,
      current_location: hero.location,
    };

    axios
      .post(`/api/heroes/`, data, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setHero({
          id: response.data.id,
          name: response.data.name,
          rank: response.data.rank,
          original_location: response.data.original_location,
          current_location: response.data.current_location,
          isActive: response.data.isActive,
        });
        setSubmitted(true);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const newHero = () => {
    setHero(initialHeroState);
    setSubmitted(false);
  };

  const handleBack = () => {
    history.push(`/heroes/`);
  }

  return (
    <div className="hero_form">
      {submitted ? (
        <div>
          <div
            className="alert alert-success alert-dismissible fade show"
            role="alert"
          >
            Hero Added!
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
            Add
              </button>
          <button className="btn btn-primary" onClick={handleBack}>
            Back
              </button>
        </div>
      ) : (
        <div className='hero_card'>
          <h2>New Hero</h2>
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              className="form-control"
              placeholder='Name'
              id="name"
              required
              value={hero.name}
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
              value={hero.location}
              pattern="[\-]?\d+\.\d+\,[\-]?\d+\.\d+"
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
              value={hero.rank}
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
            <button onClick={submitHero} className="btn button-form btn-success">
              Submit
              </button>
          </div>

        </div>
      )}
    </div>
  );
};