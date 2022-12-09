// used to create arrays of ranking objects for ranking tables (e.g. in the HappinessSummary component)
const mapRanking = (strings: string[], metric?: string): IRanking[] => strings.map(text => ({ 
  text,
  metric: metric ?? undefined
}));

export default mapRanking;
