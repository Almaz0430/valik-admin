/**
 * Страница руководства пользователя
 */
import React from 'react';
import Layout from '../components/layout/Layout';
import GuidePageContent from './GuidePageContent';

const GuidePage: React.FC = () => {
  return (
    <Layout>
      <div className="py-8 px-4 sm:px-6 lg:px-8">
        <GuidePageContent />
      </div>
    </Layout>
  );
};

export default GuidePage; 