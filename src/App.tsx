import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { HomePage } from './pages/home';
import { LoginPage } from './pages/login';
import { NewItemPage } from './pages/accountAdd';
import { SignupPage } from './pages/signup';
import { TransactionDisplay } from './pages/transactionPage';
function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<LoginPage></LoginPage>} /> {/* This is the login page itself */}
        <Route path="/login" element={<LoginPage></LoginPage>} />
        <Route path="/signup" element={<SignupPage></SignupPage>} />
        <Route path='/home' element={<HomePage></HomePage>}/>
        <Route path='/addSource' element={<NewItemPage></NewItemPage>}/>
        <Route path='/transactions' element={<TransactionDisplay></TransactionDisplay>}/>
      </Routes>
    </div>
  );
}

export default App;
