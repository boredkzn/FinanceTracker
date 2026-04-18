import React, { FC, useMemo } from 'react';
import { Button, Select } from 'antd';

interface Props {
    page: number;
    total: number;
    pageSize: number;
    setPage: (fn: (p: number) => number) => void;
    setPageSize: (size: number) => void;
}

const PAGE_SIZES = [5, 10, 15];

const PaginationControls: FC<Props> = ({
                                           page,
                                           total,
                                           pageSize,
                                           setPage,
                                           setPageSize
                                       }) => {

    const totalPages = useMemo(
        () => Math.max(1, Math.ceil(total / pageSize)),
        [total, pageSize]
    );

    const isFirstPage = page === 1;
    const isLastPage = page >= totalPages;

    const handlePrev = () => setPage(p => p - 1);
    const handleNext = () => setPage(p => p + 1);

    const handlePageSizeChange = (value: number) => {
        setPageSize(value);
        setPage(() => 1);
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>

                <Button
                    disabled={isFirstPage}
                    onClick={handlePrev}
                    style={styles.button}
                >
                    Prev
                </Button>

                <div style={styles.counter}>
                    {page} / {totalPages}
                </div>

                <Button
                    disabled={isLastPage}
                    onClick={handleNext}
                    style={styles.button}
                >
                    Next
                </Button>

                <Select
                    value={pageSize}
                    onChange={handlePageSizeChange}
                    style={styles.select}
                    options={PAGE_SIZES.map(v => ({
                        value: v,
                        label: v
                    }))}
                />

            </div>
        </div>
    );
};

const styles = {
    wrapper: {
        display: 'flex',
        justifyContent: 'center',
        marginTop: 30
    },
    container: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '10px 16px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(10px)'
    },
    button: {
        color: '#fff'
    },
    counter: {
        color: '#fff',
        fontWeight: 600
    },
    select: {
        width: 90
    }
};

export default PaginationControls;