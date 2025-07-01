import {ResponsiveBar} from '@nivo/bar';

const data = [
    { month: "totales", ventas: 5000},
    { month: "entregados", ventas: 5000},
    { month: "cancelados", ventas: 5000},
];

const BarChart = ({data}) => {
    return (
      <ResponsiveBar
        data={data}
        keys={["pedidos"]}
        indexBy="month"
        margin={{ top: 20, right: 10, bottom: 20, left: 40 }}
        padding={0.3}
        colors={{ scheme: "category10" }}
        borderRadius={5}
        axisBottom={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Mes",
          legendPosition: "middle",
          legendOffset: 40,
        }}
        axisLeft={{
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: "Ventas",
          legendPosition: "middle",
          legendOffset: -50,
        }}
        enableLabel={true}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
      />
    );
};

export default BarChart;