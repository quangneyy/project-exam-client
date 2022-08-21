import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import { 
  BrowserRouter,
} from "react-router-dom";
import Layout from './Layout';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
     <Layout />
  </BrowserRouter>
  // </React.StrictMode>
);

