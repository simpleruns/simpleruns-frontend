import React from 'react';
import dynamic from 'next/dynamic';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const LineChart = (props) => {
  const { series, options } = props;

  return (
    <ApexCharts options={options} series={series} type="line" height="100%" width="100%" />
  );
};

export default LineChart;

