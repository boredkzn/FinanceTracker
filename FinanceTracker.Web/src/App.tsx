import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Dashboard from './pages/Dashboard';
import CreateTransaction from './pages/CreateTransaction';
import { Card, Typography } from 'antd';
import IncomeJournal from "./pages/IncomeJournal.tsx";
import ExpenseJournal from "./pages/ExpenseJournal.tsx";

const { Title, Text } = Typography;

const SettingsPage = () => (
  <div style={{ padding: '24px' }}>
    <Title level={2} style={{ color: '#fff' }}>Настройки</Title>
    <Card className="card">
      <Text style={{ color: 'rgba(255,255,255,0.45)' }}>Здесь будут настройки профиля и приложения.</Text>
    </Card>
  </div>
);

function App() {
  return (
    <Router>
      <MainLayout>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create-transaction" element={<CreateTransaction />} />
             <Route path="/income" element={<IncomeJournal />} />
            <Route path="/expenses" element={<ExpenseJournal />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}

export default App;
