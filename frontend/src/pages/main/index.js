import React, { useState } from 'react';
import axios from 'axios';

function MainPage() {
  const [engine, setEngine] = useState('baidu');
  const [query, setQuery] = useState('');

  const handleEngineChange = (e) => setEngine(e.target.value);
  const handleQueryChange = (e) => setQuery(e.target.value);

  const handleSearch = async () => { 
    try {
      const result = await axios.post('/search', { engine, query });
      console.log(result.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <select value={engine} onChange={handleEngineChange}>
        <option value="baidu">百度</option>
        <option value="google">Google</option>
        <option value="bing">Bing</option>
        <option value="yahoo">Yahoo</option>
      </select>

      <input type="text" value={query} onChange={handleQueryChange} />

      <button onClick={handleSearch}>搜索</button>
    </div>
  );
}

export default MainPage;