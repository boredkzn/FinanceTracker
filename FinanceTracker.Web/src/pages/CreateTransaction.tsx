import { Typography } from 'antd';
import TransactionModal from '../components/TransactionModal';
import { useLocation } from 'react-router-dom';
import { TransactionTypes } from '../api/client';

const { Title, Text } = Typography;

export default () => {
    const location = useLocation();
    const passedType = location.state?.type ?? TransactionTypes.Expense;

    return (
        <div style={{
            minHeight: '100vh',
            padding: '20px',
            display: 'flex',
            justifyContent: 'center',
            background: '#0f172a'
        }}>
            <div style={{ width: '100%', maxWidth: 600 }}>

                <Title style={{ color: '#fff' }}>Новая операция</Title>
                <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
                    Добавьте доход или расход
                </Text>

                <div style={{
                    marginTop: 20,
                    padding: 20,
                    borderRadius: 16,
                    background: 'rgba(255,255,255,0.05)'
                }}>
                    <TransactionModal isPage initialType={passedType} />
                </div>

            </div>
        </div>
    );
};