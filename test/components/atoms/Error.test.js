import { render, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Error } from '_atoms';

// example starter of how to test React components with Jest & React Testing Library
test('has no text content by default', async () => {

  // render the component, passing in whatever props we like in order to test scenarios
  render(
    <Error message=""
      expanded={false} />
  );

  // grab the component
  await waitFor(() => screen.getByRole('alert'));

  // assert what we expect to be correct
  expect(screen.getByRole('alert')).toHaveTextContent('');

});

test('has text content when props are passed', async () => {

  render(
    <Error message="We need your email to contact you"
      expanded={true} />
  );

  await waitFor(() => screen.getByRole('alert'));

  expect(screen.getByRole('alert')).toHaveTextContent('We need your email to contact you');

});
