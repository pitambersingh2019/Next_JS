import { ComponentType } from 'react';
import dynamic from 'next/dynamic';

interface IVector {
  id: string;
  component: ComponentType;
}

const vectors: IVector[] = [
  {
    id: 'business',
    component: dynamic(() => import('_components/vectors/Business'))
  },
  {
    id: 'culture',
    component: dynamic(() => import('_components/vectors/Culture'))
  },
  {
    id: 'dashboard',
    component: dynamic(() => import('_components/vectors/Dashboard'))
  },
  {
    id: 'date',
    component: dynamic(() => import('_components/vectors/Date'))
  },
  {
    id: 'discount',
    component: dynamic(() => import('_components/vectors/Discount'))
  },
  {
    id: 'facebook',
    component: dynamic(() => import('_components/vectors/Facebook'))
  },
  {
    id: 'feedback',
    component: dynamic(() => import('_components/vectors/Feedback'))
  },
  {
    id: 'happiness',
    component: dynamic(() => import('_components/vectors/Happiness'))
  },
  {
    id: 'instagram',
    component: dynamic(() => import('_components/vectors/Instagram'))
  },
  {
    id: 'linkedin',
    component: dynamic(() => import('_components/vectors/LinkedIn'))
  },
  {
    id: 'praise',
    component: dynamic(() => import('_components/vectors/Praise'))
  },
  {
    id: 'survey',
    component: dynamic(() => import('_components/vectors/Survey'))
  },
  {
    id: 'team',
    component: dynamic(() => import('_components/vectors/Team'))
  },
  {
    id: 'time',
    component: dynamic(() => import('_components/vectors/Time'))
  },
  {
    id: 'learning',
    component: dynamic(() => import('_components/vectors/Learning'))
  },
  {
    id: 'twitter',
    component: dynamic(() => import('_components/vectors/Twitter'))
  },
  {
    id: 'whitepaper',
    component: dynamic(() => import('_components/vectors/Whitepaper'))
  }
];

// similar to the useComponent hook, this is used to find a target vector component by its ID
const useVector = (id: string | undefined) => {

  const target = vectors.find(item => item.id === id);
  const component = target ? target.component : null;

  return component;

};

export default useVector;
