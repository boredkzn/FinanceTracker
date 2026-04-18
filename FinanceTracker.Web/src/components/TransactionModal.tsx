import React, { useEffect, useState, useMemo } from 'react';
import {
  Modal, Form, Input, InputNumber, Select,
  DatePicker, Button, Radio, message,
  ConfigProvider, theme
} from 'antd';
import {
  getCategories, createTransaction, updateTransaction,
  TransactionTypes, type Category, type TransactionType, type Transaction
} from '../api/client';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

interface TransactionModalProps {
  visible?: boolean;
  onClose?: () => void;
  onSuccess?: () => void;
  initialType?: TransactionType;
  editingTransaction?: Transaction | null;
  isPage?: boolean;
}

const TransactionModal: React.FC<TransactionModalProps> = ({
                                                             visible,
                                                             onClose,
                                                             onSuccess,
                                                             initialType,
                                                             editingTransaction,
                                                             isPage
                                                           }) => {

  const [form] = Form.useForm();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const transactionType = Form.useWatch('type', form);
  
  useEffect(() => {
    if (!(visible || isPage)) return;
  
    loadCategories();
  
    if (editingTransaction) {
      form.setFieldsValue({
        ...editingTransaction,
        type: editingTransaction.type,
        date: dayjs(editingTransaction.date),
      });
    } else {
      form.resetFields();
      form.setFieldsValue({
        type: initialType ?? TransactionTypes.Expense,
        date: dayjs(),
      });
    }
  }, [visible, isPage, editingTransaction, initialType]);
  
  const loadCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res);
    } catch (e) {
      console.error('Failed to load categories', e);
    }
  };
  
  const filteredCategories = useMemo(() => {
    return categories.filter(c => c.type === transactionType);
  }, [categories, transactionType]);
  
  useEffect(() => {
    const currentCatId = form.getFieldValue('categoryId');
  
    if (
        currentCatId &&
        !filteredCategories.find(c => c.id === currentCatId)
    ) {
      form.setFieldsValue({ categoryId: undefined });
    }
  }, [transactionType, filteredCategories, form]);
  
  const handleSubmit = async (values: any) => {
    setLoading(true);
  
    try {
      if (editingTransaction) {
        await updateTransaction(editingTransaction.id, values);
        message.success('Операция успешно обновлена');
      } else {
        await createTransaction(values);
        message.success('Операция успешно добавлена');
      }
  
      if (isPage) {
        navigate('/');
      } else {
        onSuccess?.();
        onClose?.();
      }
  
      form.resetFields();
  
    } catch (e) {
      message.error(`Ошибка при ${editingTransaction ? 'обновлении' : 'добавлении'} операции`);
      console.error(e);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBack = () => navigate(-1);
  
  const content = (
      <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ type: TransactionTypes.Expense, date: dayjs() }}
          requiredMark={false}
          style={{ marginTop: 8 }}
      >
  
        {!editingTransaction ? (
            <Form.Item name="type">
              <Radio.Group
                  block
                  optionType="button"
                  buttonStyle="solid"
                  className="custom-radio-group"
              >
                <Radio.Button value={TransactionTypes.Income}>
                  Доход
                </Radio.Button>
                <Radio.Button value={TransactionTypes.Expense}>
                  Расход
                </Radio.Button>
              </Radio.Group>
            </Form.Item>
        ) : (
            <Form.Item name="type" hidden>
              <Input />
            </Form.Item>
        )}
  
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <Form.Item
              name="amount"
              label={<span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Сумма</span>}
              rules={[{ required: true, message: 'Введите сумму' }]}
          >
            <InputNumber
                style={{ width: '100%' }}
                min={0.01}
                precision={2}
                placeholder="0.00"
                size="large"
                prefix={<span style={{ color: 'rgba(255,255,255,0.25)' }}>₽</span>}
            />
          </Form.Item>
  
          <Form.Item
              name="date"
              label={<span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Дата</span>}
              rules={[{ required: true, message: 'Выберите дату' }]}
          >
            <DatePicker
                style={{ width: '100%' }}
                format="DD.MM.YYYY"
                size="large"
                allowClear={false}
            />
          </Form.Item>
        </div>
  
        <Form.Item
            name="categoryId"
            label={<span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Категория</span>}
            rules={[{ required: true, message: 'Выберите категорию' }]}
        >
          <Select
              disabled={!!editingTransaction}
              placeholder="Выберите категорию"
              size="large"
          >
            {filteredCategories.map((c) => (
                <Select.Option key={c.id} value={c.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  fontSize: 18,
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: `${c.color}20`,
                  borderRadius: 8
                }}>
                  {c.icon}
                </span>
                    <span>{c.name}</span>
                  </div>
                </Select.Option>
            ))}
          </Select>
        </Form.Item>
  
        <Form.Item
            name="title"
            label={<span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Заголовок</span>}
            rules={[{ required: true, message: 'Введите название' }]}
        >
          <Input placeholder="Например: Покупка продуктов" size="large" />
        </Form.Item>
  
        <Form.Item
            name="description"
            label={<span style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>Описание</span>}
        >
          <Input.TextArea placeholder="Дополнительная информация (необязательно)" rows={2} />
        </Form.Item>
  
        <div style={{ marginTop: 32 }}>
          <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              size="large"
              style={{
                height: 50,
                fontSize: 16,
                fontWeight: 600,
                background: transactionType === TransactionTypes.Income
                    ? 'linear-gradient(135deg, #10b981, #059669)'
                    : 'linear-gradient(135deg, #3b82f6, #2563eb)',
                border: 'none',
              }}
          >
            Подтвердить операцию
          </Button>
  
          {isPage && (
              <Button
                  onClick={handleBack}
                  block
                  size="large"
                  style={{
                    marginTop: 10,
                    height: 44,
                    borderRadius: 10,
                    background: 'rgba(255,255,255,0.05)',
                    color: 'rgba(255,255,255,0.65)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
              >
                Назад
              </Button>
          )}
  
          {editingTransaction && (
              <Button
                  type="text"
                  onClick={onClose}
                  block
                  style={{ marginTop: 8, color: 'rgba(255,255,255,0.45)' }}
              >
                Отмена
              </Button>
          )}
        </div>
  
      </Form>
  );
  
  if (isPage) {
    return (
        <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
          {content}
        </ConfigProvider>
    );
  }
  
  return (
      <ConfigProvider theme={{ algorithm: theme.darkAlgorithm }}>
        <Modal open={visible} onCancel={onClose} footer={null}>
          {content}
        </Modal>
      </ConfigProvider>
  );
};

export default TransactionModal;