import React from 'react';
import dynamic from 'next/dynamic';

const ApexCharts = dynamic(() => import('react-apexcharts'), { ssr: false });

const BarChart = (props) => {
  const { series, options } = props;

  return (
    <ApexCharts options={options} series={series} type="bar" height={350} />
  );
};

export default BarChart;
