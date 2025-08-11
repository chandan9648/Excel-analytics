import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#22c55e', '#ef4444'];

const SuccessFailPieChart = ({ success, fail }) => {
	const data = [
		{ name: 'Success', value: success },
		{ name: 'Fail', value: fail },
	];

	return (
		<ResponsiveContainer width="100%" height={200}>
			<PieChart>
				<Pie
					data={data}
					cx="50%"
					cy="50%"
					labelLine={false}
					label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
					outerRadius={60}
					fill="#8884d8"
					dataKey="value"
				>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
					))}
				</Pie>
				<Tooltip />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
};

export default SuccessFailPieChart;
