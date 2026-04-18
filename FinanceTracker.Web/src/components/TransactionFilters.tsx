import React, { FC, useMemo } from 'react';
import { Row, Col, Input, Select, DatePicker, Button } from 'antd';
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons';

interface Props {
    search: string;
    setSearch: (v: string) => void;
    category: number | null;
    setCategory: (v: number | null) => void;
    categories: any[];
    setDate: (v: [string, string] | null) => void;
    reset: () => void;
    type: any;
}

const TransactionFilters: FC<Props> = ({
                                           search,
                                           setSearch,
                                           category,
                                           setCategory,
                                           categories,
                                           setDate,
                                           reset,
                                           type
                                       }) => {
    
    const filteredCategories = useMemo(
        () => categories.filter(c => c.type === type),
        [categories, type]
    );
    
    const categoryOptions = useMemo(
        () =>
            filteredCategories.map(c => ({
                value: c.id,
                label: (
                    <div style={styles.option}>
                        <span>{c.icon}</span>
                        <span>{c.name}</span>
                    </div>
                )
            })),
        [filteredCategories]
    );

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleDate = (d: any) => {
        if (!d) return setDate(null);
        setDate([d[0].toISOString(), d[1].toISOString()]);
    };

    return (
        <Row gutter={[12, 12]}>

            <Col xs={24} sm={12} md={6}>
                <Input
                    placeholder="Поиск..."
                    prefix={<SearchOutlined />}
                    value={search}
                    onChange={handleSearch}
                    style={styles.input}
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <Select
                    placeholder="Категория"
                    allowClear
                    value={category}
                    onChange={setCategory}
                    options={categoryOptions}
                    style={styles.full}
                    size="large"
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <DatePicker.RangePicker
                    placeholder={["Начало", "Конец"]}
                    style={styles.input}
                    onChange={handleDate}
                />
            </Col>

            <Col xs={24} sm={12} md={6}>
                <Button
                    block
                    icon={<ReloadOutlined />}
                    onClick={reset}
                    style={styles.input}
                >
                    Сброс
                </Button>
            </Col>

        </Row>
    );
};

const styles = {
    full: {
        width: '100%'
    },
    input: {
        width: '100%',
        height: 40
    },
    option: {
        display: 'flex',
        gap: 8
    }
};

export default TransactionFilters;