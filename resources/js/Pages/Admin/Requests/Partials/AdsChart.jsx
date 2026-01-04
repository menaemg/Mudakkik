import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function AdsChart({ state }) {
  const pieData = {
    labels: ["قيد المراجعة", "مقبول", "مرفوض", "في انتظار الدفع"],
    datasets: [
      {
        data: [
          state.pending || 0,
          state.approved || 0,
          state.rejected || 0,
          state.waiting_payment || 0,
        ],
        backgroundColor: [
          "rgba(234, 179, 8, 0.25)", // yellow
          "rgba(34, 197, 94, 0.25)", // green
          "rgba(239, 68, 68, 0.25)", // red
          "rgba(100, 100, 100, 0.25)", // gray
        ],
        borderColor: [
          "rgb(234, 179, 8)",
          "rgb(34, 197, 94)",
          "rgb(239, 68, 68)",
          "rgb(100, 100, 100)",
        ],
        borderWidth: 2,
        hoverOffset: 10,
      },
    ],
  };
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,

    plugins: {
      legend: {
        position: "right",
        rtl: true,
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "#001246",
        titleFont: { size: 13, weight: "bold" },
        bodyFont: { size: 12 },
        padding: 12,
        cornerRadius: 12,
      },
    },
    animation: {
      animateRotate: true,
      duration: 1200,
    },
  };

  return (
    <>
      <Pie data={pieData} options={pieOptions} />
    </>
  );
}
