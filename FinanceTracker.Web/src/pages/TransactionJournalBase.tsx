import React, { useState, useEffect } from 'react';
import {
    Card, Row, Typography,
    Button, Tag, Popconfirm, Table, Space, ConfigProvider, theme
} from 'antd';

import { useNavigate } from 'react-router-dom';
import {
    PlusOutlined, EditOutlined, DeleteOutlined
} from '@ant-design/icons';

import {
    getTransactions,
    getCategories,
    deleteTransaction,
    TransactionTypes
} from '../api/client';

import TransactionModal from '../components/TransactionModal';
import TransactionFilters from '../components/TransactionFilters';
import PaginationControls from '../components/PaginationControls';
import { type Transaction } from '../api/client';
import { Grid } from 'antd';
import dayjs from 'dayjs';

const { Title, Text } = Typography;

const { useBreakpoint } = Grid;

const glassCard = {
    background: 'rgba(255,255,255,0.05)',
    backdropFilter: 'blur(20px)',
    borderRadius: 20,
    border: '1px solid rgba(255,255,255,0.08)'
};

const TransactionJournalBase = ({ type }) => {

    const navigate = useNavigate();

    const screens = useBreakpoint();
    const isMobile = !screens.md;
    
    const [data, setData] = useState<Transaction[]>([]);
    const [categories, setCategories] = useState([]);

    const [search, setSearch] = useState('');
    const [category, setCategory] = useState<number | null>(null);
    const [date, setDate] = useState<[string, string] | null>(null);

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [total, setTotal] = useState(0);

    const [sortBy, setSortBy] = useState('date');
    const [order, setOrder] = useState('desc');

    const [editing, setEditing] = useState<Transaction>();
    const [modal, setModal] = useState(false);
    
    useEffect(() => {
        getCategories().then(setCategories);
    }, []);
    
    useEffect(() => {
        load();
    }, [search, category, date, page, pageSize, sortBy, order, type]);

    const load = async () => {
        const res = await getTransactions({
            page,
            pageSize,
            search,
            categoryId: category || undefined,
            sortBy,
            order,
            type,
            startDate: date?.[0],
            endDate: date?.[1]
        });

        setData(res.data);
        setTotal(res.total);
    };

    const resetFilters = () => {
        setSearch('');
        setCategory(null);
        setDate(null);
        setSortBy('date');
        setOrder('desc');
        setPage(1);
    };

    const mobileColumns = [
        {
            title: 'Операция',
            render: (_, item) => (
                <div>
                    <div style={{ color: '#fff', fontWeight: 600 }}>
                        {item.title}
                    </div>

                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
                        {item.category?.name}
                    </div>
                </div>
            )
        },
        {
            title: 'Сумма',
            render: (_, item) => (
                <span style={{
                    fontWeight: 700,
                    color: type === TransactionTypes.Income ? '#10b981' : '#ef4444'
                }}>
        {type === TransactionTypes.Income ? '+' : '-'}
                    {item.amount.toLocaleString()} ₽
      </span>
            )
        },
        {
            title: '',
            render: (_, item) => (
                <Space>
                    <Button
                        icon={<EditOutlined />}
                        onClick={() => {
                            setEditing(item);
                            setModal(true);
                        }}
                    />

                    <Popconfirm
                        title="Удалить?"
                        okText="Да"
                        cancelText="Нет"
                        onConfirm={() => deleteTransaction(item.id).then(load)}
                    >
                        <Button danger icon={<DeleteOutlined />} />
                    </Popconfirm>
                </Space>
            )
        }
    ];

    return (
        <div style={{ padding: isMobile ? 12 : 40 }}>
            
            <Row justify="space-between" align="middle" style={{ marginBottom: 30 }}>
                <div>
                    <Title style={{ color: '#fff', margin: 0 }}>
                        {type === TransactionTypes.Income ? 'Журнал доходов' : 'Журнал расходов'}
                    </Title>
                    <Text style={{ color: 'rgba(255,255,255,0.45)' }}>
                        История операций
                    </Text>
                </div>

                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => navigate('/create-transaction', { state: { type } })}
                    style={{
                        height: 48,
                        borderRadius: 12,
                        background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                        border: 'none'
                    }}
                >
                    Добавить запись
                </Button>
            </Row>
            
            <Card style={{ ...glassCard, marginBottom: 30, padding: 16 }}>
                <ConfigProvider
                    theme={{
                        algorithm: theme.darkAlgorithm,
                        token: {
                            colorBgElevated: '#1e293b',
                            borderRadius: 12
                        }
                    }}
                >
                    <TransactionFilters
                        search={search}
                        setSearch={setSearch}
                        category={category}
                        setCategory={setCategory}
                        categories={categories}
                        setDate={setDate}
                        reset={resetFilters}
                        type={type}
                    />
                </ConfigProvider>
            </Card>
            
            <Card style={glassCard}>
                <Table
                    scroll={isMobile ? undefined : { x: 800 }}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                    style={{ background: 'transparent' }}

                    onChange={(p, f, sorter: any) => {
                        if (!sorter.order) return;

                        setSortBy(sorter.field);
                        setOrder(sorter.order === 'ascend' ? 'asc' : 'desc');
                        setPage(1);
                    }}

                    columns={isMobile ? mobileColumns : [
                        {
                            title: 'Название',
                            dataIndex: 'title',
                            sorter: true,
                            render: (_: any, item: Transaction) => (
                                <div style={{ display: 'flex', gap: 10 }}>
                                    {item.category?.icon}
                                    <span style={{ color: '#fff' }}>{item.title}</span>
                                </div>
                            )
                        },
                        {
                            title: 'Категория',
                            render: (_, item) => (
                                <Tag color={item.category?.color || 'blue'}>
                                    {item.category?.name}
                                </Tag>
                            )
                        },
                        {
                            title: 'Описание',
                            render: (_, item) => (
                                <span style={{ color: 'rgba(255,255,255,0.65)' }}>
                                    {item.description || '-'}
                                </span>
                            )
                        },
                        {
                            title: 'Дата',
                            dataIndex: 'date',
                            sorter: true,
                            render: (v) => (
                                <span style={{ color: 'rgba(255,255,255,0.45)' }}>
                                    {dayjs(v).format('DD.MM.YYYY HH:mm')}
                                </span>
                            )
                        },
                        {
                            title: 'Сумма',
                            dataIndex: 'amount',
                            sorter: true,
                            render: (_, item) => (
                                <span style={{
                                    fontWeight: 700,
                                    color: type === TransactionTypes.Income ? '#10b981' : '#ef4444'
                                }}>
                                    {type === TransactionTypes.Income ? '+' : '-'}
                                    {item.amount.toLocaleString()} ₽
                                </span>
                            )
                        },
                        {
                            title: '',
                            render: (_, item) => (
                                <Space>
                                    <Button
                                        icon={<EditOutlined />}
                                        onClick={() => {
                                            setEditing(item);
                                            setModal(true);
                                        }}
                                    />

                                    <Popconfirm
                                        title="Удалить?"
                                        okText="Да"
                                        cancelText="Нет"
                                        onConfirm={() => deleteTransaction(item.id).then(load)}
                                    >
                                        <Button danger icon={<DeleteOutlined />} />
                                    </Popconfirm>
                                </Space>
                            )
                        }
                    ]}
                />
                
                <PaginationControls
                    page={page}
                    total={total}
                    pageSize={pageSize}
                    setPage={setPage}
                    setPageSize={setPageSize}
                />
            </Card>
            
            <TransactionModal
                visible={modal}
                onClose={() => setModal(false)}
                onSuccess={load}
                editingTransaction={editing}
                initialType={type}
            />

        </div>
    );
};

export default TransactionJournalBase;