import { useContext, useEffect, useState } from 'react';
import { FilterContext } from '_context';
import SurveyList from './SurveyList';
import { useFetch, useRefresh } from '_hooks';

interface IProps {
  memberId?: string | string[];
}

// define table header & sorting methods
const tableControls: IControl[] = [
  {
    text: 'Name',
    metric: 'name',
    method: 'order'
  }
];

// define order of table cells (less important here as we're only listing the name)
const tableOrder: IOrder = {
  name: null
};

// used to display a table listing of an employee's completed surveys 
const TeamSurveys = ({ memberId }: IProps) => {

  const { env, postData } = useFetch();
  const { dates } = useContext(FilterContext);
  const { refresh, bumpRefresh } = useRefresh();
  const [list, setList] = useState<ISurveyListing[] | null>(null);

  useEffect(() => {

    // fetch the survey data for that employee over the selected time range 
    if (env && memberId) {

      const data = { dates }; 

      postData(`/standard/summary/${memberId}`, data).then(response => {

        if (response?.list) setList(response.list);

      });

    }

  }, [env, dates, refresh]);

  return (
    list && (
      list.length > 0 ? (
        <SurveyList section="Surveys"
          surveys={list}
          controls={tableControls}
          order={tableOrder}
          isPercent={false}
          memberId={memberId}
          emitRefresh={bumpRefresh} />
      ) : <p className="padded">This employee hasn't completed any surveys</p>
    )
  );

};

export default TeamSurveys;
