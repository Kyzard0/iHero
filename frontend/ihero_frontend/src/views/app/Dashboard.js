import axios from "axios";
import React, { useState, useEffect, useContext, Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet';
import { SocketContext } from '../../services/socket';

const Dashboard = () => {

  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeThreats, setActiveThreats] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [monitoring, setMonitoring] = useState(false);

  const socket = useContext(SocketContext);

  useEffect(() => {
    if (localStorage.getItem('token') === null) {
      window.location.replace('/login');
    } else {
      axios
        .get(`/api/auth/user/`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Token ${localStorage.getItem('token')}`
          }
        })
        .then((response) => {
          setUsername(response.data.username);
          setLoading(false);
          loadMonitoringState();
        });
    }
  }, []);

  useEffect(() => {
    socket.on('occurrence', data => {
      handleNewThreat(data);
    });
  }, []);

  useEffect(() => {
    if (monitoring) {
      socket.connect();
    } else {
      socket.disconnect();
    }
  }, [monitoring]);

  useEffect(() => {
    retrieveAllActiveThreats();
  }, [updated]);

  useEffect(() => {
    const interval = setInterval(() => {
      updateBattlesStatus();
      deployHeroes();
      setUpdated(prevUpdate => !prevUpdate);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const retrieveAllActiveThreats = () => {
    axios
      .get(`/api/threats_active/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setActiveThreats(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  const handleNewThreat = (threat) => {
    let newThreat = {
      name: threat.monsterName,
      level: threat.dangerLevel.toUpperCase(),
      location: `${threat.location[0].lat},${threat.location[0].lng}`,
    };
    axios
      .post(`/api/threats/`, newThreat, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
      .then((response) => {
        setUpdated(!updated);
      })
      .catch((e) => {
        console.error(e.response);
      });
  };

  const deployHeroes = () => {
    axios
      .get(`/api/deploy_heroes/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
  }

  const updateBattlesStatus = () => {
    axios
      .get(`/api/update_battles/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })
  }

  const handleMonitoring = () => {
    setMonitoring(prevMonitoring => !prevMonitoring);
    saveMonitoringState();
  }

  const loadMonitoringState = () => {
    let stickedState = window.localStorage.getItem('monitoring')
    setMonitoring(stickedState !== null ? JSON.parse(stickedState) : false)
  }

  const saveMonitoringState = () => {
    console.log('salvando');
    window.localStorage.setItem('monitoring', JSON.stringify(monitoring));
  }



  const monsterIcon = L.icon({
    iconUrl: 'monster.png',
  });

  const battleIcon = L.icon({
    iconUrl: 'battle.png',
  });

  return (
    <div>
      {loading === false && (
        <Fragment>
          <h2>Threats Map</h2>
          <div className='row justify-content-between'>
            <h3>Hello {username}!</h3>
            <div className='col-sm-6'>
              <strong>Number of Active Threats: {activeThreats.length}</strong>
            </div>
            <div className='col-sm-6 d-flex justify-content-end'>
              {!monitoring ? (
                <button className='btn btn-sm btn-primary' onClick={() => handleMonitoring()}>
                  Start Monitoring
                </button>
              ) : (
                <button className='btn btn-sm btn-danger' onClick={() => handleMonitoring()}>
                  Stop Monitoring
                </button>
              )}
            </div>
          </div>
          <MapContainer center={[51.505, -0.09]} zoom={3} scrollWheelZoom={true} style={{ height: '50vh', margin: '1rem' }}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {activeThreats.length > 0 &&
              activeThreats.map((threat, index) => {
                return threat.inBattle ? (
                  <Marker key={index} icon={battleIcon} position={threat.location.split(',').map(Number)}>
                    <Popup>
                      Name: {threat.name} <br /> Danger Level: {threat.level} <br />
                      <strong>In battle with: {threat.battle_with.name}</strong>
                    </Popup>
                  </Marker>
                ) : (
                  <Marker key={index} icon={monsterIcon} position={threat.location.split(',').map(Number)}>
                    <Popup>
                      Name: {threat.name} <br /> Danger Level: {threat.level}
                    </Popup>
                  </Marker>
                )
              })}
          </MapContainer>
        </Fragment>
      )}
    </div>
  );
};

export default Dashboard;
