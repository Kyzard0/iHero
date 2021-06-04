import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css';
import './global.css';
import Navbar from './components/layout/Navbar';
import Login from './views/auth/Login';
import Signup from './views/auth/Signup';
import Logout from './views/auth/Logout';
import Dashboard from './views/app/Dashboard';
import ProtectedRoute from './components/security/ProtectedRoute';
import { HeroesList } from './views/heroes/HeroesList';
import { AddHero } from './views/heroes/AddHero';
import { UpdateHero } from './views/heroes/UpdateHero';
import { SocketContext, socket } from './services/socket';
import { ThreatsHistory } from './views/threats/ThreatsHistory';


const App = () => {
  return (
    <div className='App'>
      <Router>
        <Navbar />
        <SocketContext.Provider value={socket}>
          <Switch>
            <Route path='/login' component={Login} exact />
            <Route path='/signup' component={Signup} exact />
            <Route path='/logout' component={Logout} exact />
            <ProtectedRoute path='/' component={Dashboard} exact />
            <ProtectedRoute path='/heroes' component={HeroesList} exact />
            <ProtectedRoute path='/heroes/add/' component={AddHero} exact />
            <ProtectedRoute path='/heroes/:id/update/' component={UpdateHero} exact />
            <ProtectedRoute path='/threats/' component={ThreatsHistory} exact />
            <ProtectedRoute component={Dashboard} />
          </Switch>
        </SocketContext.Provider>
      </Router>
    </div>
  );
};

export default App;
