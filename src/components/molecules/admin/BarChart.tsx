import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Direction } from '_vectors';
import { useWindow } from '_hooks';
import { delay, pxToRem } from '_utils';
import styles from './BarChart.module.scss';

interface IProps {
  score: number;
  graph: IBarChart;
  breakpoints?: IBarChartBreakpoint[];
  classes?: string;
}

// different numbers of bars & different height of graph are rendered based on viewport width
const defaultBreakpoints: IBarChartBreakpoint[] = [
  {
    height: 250,
    columns: 9
  },
  {
    height: 250,
    columns: 13
  },
  {
    height: 250,
    columns: 21
  },
  {
    height: 250,
    columns: 17
  },
  {
    height: 250,
    columns: 21
  }
];

// used to render the bar chart graphs used in the different admin dashboards
const BarChart = ({ score, graph, breakpoints = defaultBreakpoints, classes }: IProps) => {

  const { vw } = useWindow().windowSize;
  const { change, yAxis, data } = graph;
  const dataLength = data.length;
  const isSame = change === 0;
  const isImprovement = change > 0;
  const isPercent = yAxis === 'percent';
  const averageScore = isPercent && (score % 0 !== 0) ? Math.round(score) : score;
  const [hasData, setHasData] = useState<boolean>(false);
  const [chartOptions, setChartOptions] = useState<Highcharts.Options>();
  const breakpointVars = {
    ['--height-mobile' as string]: pxToRem(breakpoints[0].height),
    ['--height-portrait' as string]: pxToRem(breakpoints[1].height),
    ['--height-landscape' as string]: pxToRem(breakpoints[2].height),
    ['--height-desktop' as string]: pxToRem(breakpoints[3].height),
    ['--height-larger' as string]: pxToRem(breakpoints[4].height)
  };

  // create the config to pass to the Highcharts plugin 
  const formatGraphData = (breakpoint: IBarChartBreakpoint): Highcharts.Options => {

    const { height, columns } = breakpoint;
    // get the newest range 
    const sliced = data.slice(dataLength - columns, dataLength);
    // ensure a tiny bar is rendered if the value is 0 
    const cols = sliced.map(({ score }) => score === 0 ? 0.05 : score);
    const cats = sliced.map(item => dayjs(item.date).format('D MMM'));
    const steps = 4;

    return {
      chart: {
        type: 'column',
        backgroundColor: 'transparent',
        height
      },
      title: { text: '' },
      credits: { enabled: false },
      tooltip: { enabled: false },
      xAxis: {
        categories: cats,
        labels: {
          step: steps
        },
        lineWidth: 0,
        minorGridLineWidth: 0,
        lineColor: 'transparent',
        offset: '10'
      },
      yAxis: {
        max: isPercent ? 100 : 5,
        tickAmount: isPercent ? 5 : 6,
        margin: 50,
        labels: {
          step: 0
        },
        gridLineWidth: 0,
        title: {
          text: ''
        }
      },
      series: [
        {
          type: 'column',
          pointWidth: 6,
          borderWidth: 0,
          borderColor: 'transparent',
          data: cols,
          showInLegend: false,
          color: {
            linearGradient: {
              x1: 0,
              x2: 0,
              y1: 0,
              y2: 1
            },
            stops: [
              [0, 'rgba(23, 230, 154, 1)'],
              [1, 'rgba(23, 230, 154, 0)']
            ]
          }
        }
      ]
    };

  };

  useEffect(() => {

    // whenever the graph data or viewport size changes, we need to generate a new config 
    if (vw) {

      if (dataLength > 0) {

        setHasData(true);

        // as default, use nine columns & 25px height
        let graphData: Highcharts.Options = formatGraphData(breakpoints[0]);

        // overwrite the default with specific config values if the viewport matches one of the following options 
        switch (true) {
  
          case (vw >= 500 && vw < 750):
            graphData = formatGraphData(breakpoints[1]);
            break;
  
          case (vw >= 750 && vw < 1000):
            graphData = formatGraphData(breakpoints[2]);
            break;
          
          case (vw >= 1000 && vw < 1550):
            graphData = formatGraphData(breakpoints[3]);
            break;
          
          case (vw >= 1550):
            graphData = formatGraphData(breakpoints[4]);
            break;
  
          default:
            break;
  
        }
  
        // give a slight visual delay to allow the animation to properly play 
        delay(100).then(() => setChartOptions(graphData));

      } else {

        setHasData(false);

      }

    }

  }, [graph, vw]);

  return (
    <div className={`${styles.root}${classes ? ' ' + classes : ''}`}>
      <header className={styles.header}>
        <h4 className="h1">{ averageScore }{isPercent ? '%' : ''}</h4>
        <div className={`${styles.change} ${!isSame && isImprovement ? styles.improve : ''}${!isSame && !isImprovement ? styles.decline : ''}`}>
          {!isSame && <Direction />}
          <small className={isSame ? 'dash' : undefined}>
            {isSame ? 'Same as last month' : (
              <>
                { change }{isPercent ? '%' : ''} {isImprovement ? 'improvement' : 'decline'} since last month
              </>
            )}
          </small>
        </div>
      </header>
      <figure style={breakpointVars}
        className={styles.chart}>
        {hasData ? (
          <HighchartsReact highcharts={Highcharts}
            options={chartOptions} />
        ) : <p>There's no data to display. Please choose a larger date range or fewer reporting filters</p>}
      </figure>
    </div>
  );

};

export default BarChart;
