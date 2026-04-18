import React, { useState, useEffect } from 'react';
import {Row, Col, Card, Statistic, Typography, Skeleton, Table, theme, ConfigProvider} from 'antd';
import { 
  ArrowUpRight, 
  TrendingUp,
} from 'lucide-react';
import { getAnalytics } from '../api/client';
import TransactionModal from '../components/TransactionModal';
import dayjs from 'dayjs';
import {useNavigate} from "react-router-dom";
import { DatePicker } from 'antd';
import { Grid } from 'antd';
const { useBreakpoint } = Grid;
const { Title, Text } = Typography;

const Dashboard: React.FC = () => {
    useNavigate();
    const screens = useBreakpoint();
    const isMobile = !screens.md;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [dateRange, setDateRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
        dayjs().startOf('year'),
        dayjs().endOf('year')
    ]);
    
  useEffect(() => {
    loadData();
  }, [dateRange]);

  const loadData = async () => {
    setLoading(true);
    try {
        const start = dateRange?.[0]?.toISOString();
        const end = dateRange?.[1]?.toISOString();
        
        const res = await getAnalytics(start, end);
      setData(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };


  if (loading && !data) return <div style={{ padding: 40 }}><Skeleton active paragraph={{ rows: 12 }} /></div>;

  const totalTransactions = data?.categoryStats?.reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;

  return (
    <div style={{ padding: '40px' }}>
      <Row justify="space-between" align="middle" style={{ marginBottom: 40 }}>
        <Col>
          <Title level={1} style={{ color: '#fff', margin: 0, fontWeight: 800, fontSize: 36 }}>Обзор Финансов</Title>
          <Text style={{ color: 'rgba(255,255,255,0.45)', fontSize: 16 }}>
            Ваша финансовая активность за все время.
          </Text>
        </Col>
        <Col>
            <ConfigProvider
                theme={{
                    algorithm: theme.darkAlgorithm,
                    token: {
                        colorBgElevated: '#1e293b',
                        borderRadius: 12
                    }
                }}
            >
            <DatePicker.RangePicker
                color={"white"}
                placeholder={["Начало","Конец"]}
                value={dateRange as any}
                onChange={(dates) => {
                    if (!dates) {
                        setDateRange(null); 
                        return;
                    }
                    setDateRange([dates[0], dates[1]]);
                }}
                style={{
                    height: 44,
                    borderRadius: 12
                }}
                
            />
            </ConfigProvider>
        </Col>
      </Row>
      
      <Row gutter={[32, 32]} style={{ marginBottom: 40 }}>
        <Col xs={24} md={8}>
          <Card bordered={false} className="card" style={{ background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(15, 23, 42, 0.65) 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}><ArrowUpRight size={16} /> Доходы</span>}
              value={data?.totalIncome || 0}
              precision={2}
              valueStyle={{ color: '#10b981', fontSize: 32, fontWeight: 800 }}
              suffix="₽"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="card" style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(15, 23, 42, 0.65) 100%)' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 8 }}><TrendingUp size={16} style={{ transform: 'rotate(90deg)' }} /> Расходы</span>}
              value={data?.totalExpense || 0}
              precision={2}
              valueStyle={{ color: '#ef4444', fontSize: 32, fontWeight: 800 }}
              suffix="₽"
            />
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card bordered={false} className="card" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(15, 23, 42, 0.65) 100%)' }}>
            <Statistic 
                title={<span style={{ color: 'rgba(255,255,255,0.45)', fontWeight: 600 }}>Всего операций</span>}
                value={totalTransactions}
                valueStyle={{ color: '#fff', fontSize: 32, fontWeight: 800 }}
            />
          </Card>
        </Col>
      </Row>
        
      <Row gutter={[32, 32]}>
        <Col xs={24}>
          <Card className="card" title={<Title level={4} style={{ color: '#fff', margin: 0 }}>Детальная аналитика категорий</Title>}>
              {isMobile ? (
                  <div>
                      {(data?.categoryStats || []).map((record: any) => (
                          <Card
                              key={record.category}
                              style={{
                                  marginBottom: 12,
                                  background: 'transparent',
                                  border: '1px solid rgba(255,255,255,0.08)'
                              }}
                          >
                              <div style={{ display: 'flex', justifyContent: 'space-between' }}>

                                  {/* Левая часть */}
                                  <div style={{ display: 'flex', gap: 12 }}>
                                      <div style={{
                                          width: 40,
                                          height: 40,
                                          borderRadius: 10,
                                          background: `${record.color}15`,
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center'
                                      }}>
                                          {record.icon}
                                      </div>

                                      <div>
                                          <div style={{ color: '#fff', fontWeight: 600 }}>
                                              {record.category}
                                          </div>

                                          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                                              {record.count} операций
                                          </div>
                                      </div>
                                  </div>

                                  {/* Правая часть */}
                                  <div style={{ textAlign: 'right' }}>
                                      <div style={{ color: '#fff', fontWeight: 700 }}>
                                          {record.total.toLocaleString()} ₽
                                      </div>

                                      <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                                          ср. {record.average.toFixed(2)} ₽
                                      </div>
                                  </div>
                              </div>
                          </Card>
                      ))}
                  </div>
              ) : (
              <Table 
                dataSource={data?.categoryStats || []} 
                pagination={false}
                rowKey="category"
                columns={[
                    { 
                        title: 'Категория', 
                        key: 'category', 
                        render: (_, record: any) => (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                                <div style={{ 
                                    width: 40, 
                                    height: 40, 
                                    borderRadius: 10, 
                                    background: `${record.color}15`, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    fontSize: 20
                                }}>
                                    {record.icon}
                                </div>
                                <Text style={{color: '#f1f5f9', fontWeight: 600, fontSize: 16 }}>{record.category}</Text>
                            </div>
                        )
                    },
                    { 
                        title: 'Сумма', 
                        dataIndex: 'total', 
                        key: 'total', 
                        sorter: (a: any, b: any) => a.total - b.total,
                        render: (val) => <Text style={{color: '#fff', fontWeight: 700, fontSize: 16}}>{val.toLocaleString()} ₽</Text> 
                    },
                    { 
                        title: 'Кол-во', 
                        dataIndex: 'count', 
                        key: 'count', 
                        sorter: (a: any, b: any) => a.count - b.count,
                        render: (val) => <Text style={{color: 'rgba(255,255,255,0.45)', fontWeight: 500}}>{val}</Text> 
                    },
                    { 
                        title: 'Средний чек', 
                        dataIndex: 'average', 
                        key: 'average', 
                        sorter: (a: any, b: any) => a.average - b.average,
                        render: (val) => <Text style={{color: '#fff', fontWeight: 600}}>{val.toLocaleString(undefined, {minimumFractionDigits: 2})} ₽</Text> 
                    },
                    {
                        title: 'Доля',
                        key: 'share',
                        render: (_, record: any) => (
                            <div style={{ width: '100%', minWidth: 150, display: 'flex', alignItems: 'center', gap: 12 }}>
                                <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.05)', borderRadius: 4, overflow: 'hidden' }}>
                                    <div style={{ 
                                        width: `${(record.total / data.totalExpense) * 100}%`, 
                                        height: '100%', 
                                        background: record.color || '#3b82f6',
                                        boxShadow: `0 0 10px ${record.color}40`
                                    }} />
                                </div>
                                <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13, fontWeight: 700 }}>
                                    {((record.total / data.totalExpense) * 100).toFixed(1)}%
                                </Text>
                            </div>
                        )
                    }
                ]}
                style={{ background: 'transparent' }}
            />
              )}
          </Card>
        </Col>
      </Row>

      <TransactionModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onSuccess={loadData} 
      />
    </div>
  );
};

export default Dashboard;
