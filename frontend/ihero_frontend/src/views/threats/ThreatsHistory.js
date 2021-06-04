import axios from "axios";
import React, { useState, useEffect, useRef } from "react";

export const ThreatsHistory = () => {
  const [threats, setThreats] = useState([]);
  const countRef = useRef(0);

  useEffect(() => {
    retrieveAllThreats();
  }, [countRef]);

  const retrieveAllThreats = () => {
    axios
      .get(`/api/threats/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setThreats(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const getDuration = (initial, final) => {
    let time = final - initial
    let minutes = Math.floor(time / 60);
    let seconds = time - minutes * 60;
    return `${minutes}m ${seconds}s`
  }

  return (
    <div className="row justify-content-center div-table">
      <h2>Threat's History</h2>
      <table id="table" className="table table-bordered table-hover">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Level</th>
            <th scope="col">Duration</th>
            <th scope="col">Beaten By</th>
            <th scope="col">Battle Duration</th>
            <th scope="col">Location</th>
          </tr>
        </thead>
        <tbody>
          {threats && threats.map((threat, index) => {
            return !threat.isActive && (
              <tr key={threat.id} >
                <td>{threat.name}</td>
                <td>{threat.level}</td>
                <td>{getDuration(threat.start_timestamp, threat.battle_end_timestamp)}</td>
                {!threat.battle_with ? (
                  <td></td>
                ) : (
                  <td>{threat.battle_with.name}</td>
                )}
                <td>{getDuration(threat.battle_start_timestamp, threat.battle_end_timestamp)}</td>
                <td>{threat.location}</td>
              </tr>
            )
          }
          )}
          {!threats &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="spinner-border spinner-border-lg align-center"></div>
              </td>
            </tr>
          }
          {threats && !threats.length &&
            <tr>
              <td colSpan="4" className="text-center">
                <div className="p-2">No Data To Display</div>
              </td>
            </tr>
          }
        </tbody>
      </table>
    </div>
  );
};