export function useCharts() {
  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    layout: { padding: { left: 16, right: 16 } },
    scales: {
      x: { offset: true, grid: { drawOnChartArea: false }, ticks: { color: '#cbd5e1', autoSkip: false, maxRotation: 0 } },
      y: { beginAtZero: true, ticks: { precision: 0 } }
    }
  };

  const donutOptions = {
    plugins: { legend: { position: 'right' } },
    cutout: '60%'
  };

  return { lineOptions, donutOptions };
}
