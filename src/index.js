import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import User from './components/User/User';
import Admin from './components/Admin/Admin';
import HomePage from './components/Home/HomePage';
import ManageUser from './components/Admin/Content/ManageUser';
import DashBoard from './components/Admin/Content/DashBoard';
import Login from './components/Auth/Login';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
     <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} />
        <Route path="users" element={<User />} />
      </Route>

      <Route path="/admins" element={<Admin />} >
        <Route index element={<DashBoard />} />
        <Route path="manage-users" element={<ManageUser />} />
      </Route>

      <Route path="/login" element={<Login />} />
      
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);

