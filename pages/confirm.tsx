import { useRouter } from 'next/router';
import { Button } from '_atoms';
import { Header, Footer } from '_molecules';
import { IPage } from '_organisms';
import { serverMarketing } from '_utils';

// this page is linked to after a user answers a survey directly from an email - the different content is based on the status value in the query string
const Confirm = ({ global }: IPage) => {

  const router = useRouter();
  const { status } = router.query;
  const isSuccess = status === 'success';
  const isError = status === 'error';
  const isUnauth = status === 'unauthorised';
  const { json } = global;

  // if the survey submission was successful, it has a different heading to the other possibilities - logic extracted here to keep the JSX neat & tidy
  const getHeadingText = (): string => isSuccess ? 'Thank you' : 'Oops';

  // this switch statement works out what to render as the user-friendly message in the page body
  const getBodyText = (): string => {

    let text = '';

    switch (true) {

      case isSuccess:
        text = 'Your answers have been submitted';
        break;

      case status === 'expired':
        text = 'This survey has expired. Active surveys will appear on your dashboard';
        break;

      case status === 'duplicate':
        text = `You’ve already answered this survey. Unanswered surveys will appear on your dashboard`;
        break;

      case isUnauth:
        text = `We couldn’t match your user`;
        break;

      case isError:
        text = 'Something went wrong';
        break;

      default:
        break;

    }

    if (isUnauth || isError) text += '. Please try again';

    return text;

  };

  return (
    <div className="wrapper employee">
      <Header content={json.nav.header} 
        background={false} />
      <main role="main">
        <article className="success">
          <h2>{ getHeadingText() }</h2>
          <p className="text--medium">{ getBodyText() }</p>
          <Button target="/login"
            prominence="primary"
            text="Go to your dashboard" />
        </article>
      </main>
      <Footer content={json}
        footerBlock={false} />
    </div>
  );

};

export const getServerSideProps = async ({ res, resolvedUrl }: IPageContext) => serverMarketing(resolvedUrl, res, true);

export default Confirm;
