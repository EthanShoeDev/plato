import './App.css';

import SsrRocketCar from './components/ssrRocketCar';

function App() {
  return (
    <>
      <SsrRocketCar fallback={() => <p>Loading...</p>} />
    </>
  );
}

export default App;
