import { PageContainer } from '@ant-design/pro-components';
import { Card, Empty } from 'antd';
import React from 'react';

const EmptyPage: React.FC = () => {
  return (
    <PageContainer>
      <Card bordered={false}>
        <Empty
          description="该功能子系统正在开发中，敬请期待..."
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      </Card>
    </PageContainer>
  );
};

export default EmptyPage;
