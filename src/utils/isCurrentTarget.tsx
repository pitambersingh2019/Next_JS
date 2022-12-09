import { MouseEvent } from 'react';

// used to work out whether whatever was clicked was the active element (useful for things like closing a nav when the user clicks elsewhere on the page)
const isCurrentTarget = (e: MouseEvent<HTMLElement>): boolean => (e.target === e.currentTarget);

export default isCurrentTarget;
