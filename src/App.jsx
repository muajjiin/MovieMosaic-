import React, { use, useEffect, useState } from 'react';
// import logo from './logo.svg';
import Search from './components/Search';
import './App.css';

const App = () => {
const[searchTerm, setSearchTerm] = useState('')


  return (
    <main>
     <div className='pattern'> 
     <div className='wrapper'> 
      <header>  <
        img src="./hero-img.png" alt="Banner" />
        <h1>find  <span className='text-gradient'>Movies</span> you'll Enojoy without the Hassle</h1>
      </header>

      <header>
        <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </header>

     </div>
     <h1 className='text-white'>{searchTerm}</h1>
    </div>
    </main>
  ) 
  
}


export default App;