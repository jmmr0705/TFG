import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { SampleComponent } from './componentes/sample-component/sample-component'
import { Registro } from './componentes/registro/registro';

const Home = () => {
  return (
    <div>
      <SampleComponent />
    </div>
  );
};

const About = () => {
  return(
  <div>
      <Registro />
  </div>
  );
}

function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/about" element={<About />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
