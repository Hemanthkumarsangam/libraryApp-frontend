import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import './App.css';
import HomePage from './components/home/HomePage';
import Profile from './components/profile/Profile';
import Lend from './components/lend/Lend';
import Borrow from './components/borrow/Borrow';
import Return from './components/return/Return';
import UpdateName from './components/updating/UpdateName';
import Sale from './components/sale/Sale';
import { Login } from './components/login/Login';
import SignUp from './components/login/SignUp'  
import Otp from './components/otp/Otp';
import Admin from './components/admin/Admin';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/lend' element={<Lend />} />
        <Route path='/borrow' element={<Borrow />} />
        <Route path='/return' element={<Return />} />
        <Route path='/changeName' element={<UpdateName />} />
        <Route path='/sale' element={<Sale />} />
        <Route path='/otp' element={<Otp />} />
        <Route path='/admin' element={<Admin />} />
      </Routes>
    </Router>
  );
}

export default App;