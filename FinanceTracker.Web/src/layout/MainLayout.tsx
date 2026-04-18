import React, { useState } from 'react';
import { Layout, Menu, Button, Typography, Drawer, Grid } from 'antd';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;
const { useBreakpoint } = Grid;

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const screens = useBreakpoint();
  const isMobile = !screens.md;

  const location = useLocation();

  const menuItems = [
    {
      key: '/',
      icon: <LayoutDashboard size={20} />,
      label: <Link to="/">Дашборд</Link>,
    },
    {
      key: '/income',
      icon: <TrendingUp size={20} color="#52c41a" />,
      label: <Link to="/income">Доходы</Link>,
    },
    {
      key: '/expenses',
      icon: <TrendingDown size={20} color="#ff4d4f" />,
      label: <Link to="/expenses">Расходы</Link>,
    },
  ];

  const renderMenu = (onClick?: () => void) => (
      <>
        <div style={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed && !isMobile ? 'center' : 'flex-start',
          padding: '0 24px',
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <div style={{
            width: 32,
            height: 32,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            marginRight: collapsed && !isMobile ? 0 : 12,
          }}>
            💰
          </div>

          {(!collapsed || isMobile) && (
              <Title level={4} style={{ margin: 0, fontSize: 18, color: '#fff' }}>
                Финансовый трекер
              </Title>
          )}
        </div>

        <Menu
            mode="inline"
            theme="dark"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={onClick}
            style={{ background: 'transparent', borderRight: 0, marginTop: 16 }}
        />
      </>
  );

  return (
      <Layout style={{ minHeight: '100vh', background: 'transparent' }}>

        {!isMobile && (
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                theme="dark"
                width={250}
                style={{
                  background: 'rgba(15, 23, 42, 0.95)',
                  backdropFilter: 'blur(10px)',
                  borderRight: '1px solid rgba(255,255,255,0.1)'
                }}
            >
              {renderMenu()}
            </Sider>
        )}

        {isMobile && (
            <Drawer
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                placement="left"
                styles={{
                  body: {
                    padding: 0,
                    background: 'rgba(15, 23, 42, 0.95)'
                  }
                }}
            >
              {renderMenu(() => setMobileOpen(false))}
            </Drawer>
        )}

        <Layout style={{ background: 'transparent' }}>
          <Header style={{
            padding: isMobile ? '0 12px' : '0 24px',
            background: 'rgba(15, 23, 42, 0.8)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            zIndex: 9
          }}>

            <Button
                type="text"
                icon={
                  isMobile
                      ? <span style={{ fontSize: 18 }}>☰</span>
                      : (collapsed
                          ? <ChevronRight size={20} color="#fff" />
                          : <ChevronLeft size={20} color="#fff" />)
                }
                onClick={() => {
                  if (isMobile) {
                    setMobileOpen(true);
                  } else {
                    setCollapsed(!collapsed);
                  }
                }}
                style={{ width: 40, height: 40 }}
            />

            <div />
          </Header>

          <Content
              style={{
                margin: isMobile ? '12px' : '24px 16px',
                padding: 0,
                minHeight: 280,
                overflow: 'auto'
              }}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
  );
};

export default MainLayout;