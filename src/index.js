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

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
     <Routes>
      <Route path="/" element={<App />}>
        <Route index element={<HomePage />} ></Route>
        <Route path="users" element={<User />} />
      </Route>
       <Route path="admins" element={<Admin />} />
    </Routes>
  </BrowserRouter>
  // </React.StrictMode>
);

