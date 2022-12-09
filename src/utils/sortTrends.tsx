// sort an array of trends by their 'change' value
const sortTrends = (trends: ITrend[]): ITrend[] => trends.sort((a: ITrend, b: ITrend) => b.change - a.change);

export default sortTrends;
