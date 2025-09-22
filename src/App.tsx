import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StatisticalTestsPage from './pages/StatisticalTestsPage';
import DistributionsPage from './pages/DistributionsPage';
import CalculatorsPage from './pages/CalculatorsPage';

function App() {
  return (
    <Router basename="/bda">
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/tests" element={<StatisticalTestsPage />} />
          <Route path="/distributions" element={<DistributionsPage />} />
          <Route path="/calculators" element={<CalculatorsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;