import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import viVN from 'antd/locale/vi_VN';
import './styles/variables.css';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

// Ant Design v5 Theme Customization - Navy Blue / Gold / Crimson Theme
const themeConfig = {
  token: {
    fontFamily: "'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    colorPrimary: '#1e3a8a', // Xanh Navy
    colorInfo: '#1e3a8a',
    colorSuccess: '#059669',
    colorWarning: '#d97706', // Vàng Gold
    colorError: '#dc2626',   // Đỏ Crimson
    borderRadius: 8,
    controlHeight: 40,
    wireframe: false,
  },
  components: {
    Layout: {
      headerBg: '#ffffff',
      bodyBg: '#f8fafc',
      siderBg: '#0f172a',
    },
    Menu: {
      itemBorderRadius: 8,
      darkItemBg: '#0f172a',
      darkItemSelectedBg: '#1e3a8a',
      darkItemSelectedColor: '#ffffff',
      darkItemColor: '#94a3b8',
      darkItemHoverColor: '#ffffff',
    },
    Card: {
      boxShadowTertiary: '0 4px 12px rgba(15, 23, 42, 0.04)',
      borderRadiusLG: 12,
    },
    Button: {
      controlHeight: 40,
      borderRadius: 8,
      colorPrimary: '#1e3a8a',
      colorPrimaryHover: '#1d4ed8',
      fontWeight: 600,
    },
    Input: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Select: {
      controlHeight: 40,
      borderRadius: 8,
    },
    Table: {
      headerBg: '#f8fafc',
      headerColor: '#475569',
      borderRadius: 12,
    }
  }
};

import { LanguageProvider } from './context/LanguageContext';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider theme={themeConfig} locale={viVN}>
        <LanguageProvider>
          <RouterProvider router={router} />
        </LanguageProvider>
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;
