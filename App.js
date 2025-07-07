import React from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import UserBook from './Components/UserBook';
import Books from './Components/Books';
import Users from './Components/Users';
import BorrowDetails from './Components/BorrowDetails';
import Dashboard from './Pages/Dashboard';

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/user-book' element={<UserBook/>}/>
          <Route path='/book' element={<Books/>}/>
          <Route path='/user' element={<Users/>}/>
          <Route path='/borrow-details' element={<BorrowDetails/>}/>
          <Route path='/' element={<Dashboard/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;