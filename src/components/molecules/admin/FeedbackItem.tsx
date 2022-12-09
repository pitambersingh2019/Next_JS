import { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useFetch } from '_hooks';
import { globals } from '_utils';

interface IProps {
  id: string | string[];
}

const { shortDate } = globals;

// used to display an individual feedback item
const FeedbackItem = ({ id }: IProps) => {

  const { env, fetchData } = useFetch();
  const [suggestion, setSuggestion] = useState<ISuggestion | null>(null);

  useEffect(() => {

    // on mount, fetch the data using the unique ID
    if (env) fetchData(`/feedback/${id}`).then(response => {

      setSuggestion(response);

    });

  }, [env]);

  return (
    <section className="dashboard-single card">
      <h1 className="h4">Open suggestions and feedback</h1>
      <ul className="dashboard__info">
        <li className="text--medium">
          <h2 className="text--small">Date</h2>
          {dayjs(suggestion?.date).format(shortDate)}
        </li>
        <li className="text--medium">
          <h2 className="text--small">Sender</h2>
          { suggestion?.employee }
        </li>
      </ul>
      <p>{ suggestion?.message }</p>
    </section>
  );

};

export default FeedbackItem;
