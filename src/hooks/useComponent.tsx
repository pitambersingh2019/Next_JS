import { ComponentType } from 'react';
import dynamic from 'next/dynamic';
import {
  IActivateAccountForm,
  IContactUsExtra,
  IContactUsForm,
  IFeatures,
  IForgotPasswordForm,
  IHowItWorks,
  ILoginForm,
  ILogoWall,
  IProductOverview,
  IResetPasswordForm,
  IRichText,
  IUspBar
} from '_organisms';

interface IDynamic {
  ActivateAccountForm: ComponentType<IActivateAccountForm>;
  ContactUsExtra: ComponentType<IContactUsExtra>;
  ContactUsForm: ComponentType<IContactUsForm>;
  ForgotPasswordForm: ComponentType<IForgotPasswordForm>;
  Features: ComponentType<IFeatures>;
  HowItWorks: ComponentType<IHowItWorks>;
  LoginForm: ComponentType<ILoginForm>;
  LogoWall: ComponentType<ILogoWall>;
  ProductOverview: ComponentType<IProductOverview>;
  ResetPasswordForm: ComponentType<IResetPasswordForm>;
  RichText: ComponentType<IRichText>;
  UspBar: ComponentType<IUspBar>;
}

const dynamicComponents: IDynamic = {
  ActivateAccountForm: dynamic(() => import('_components/organisms/marketing/ActivateAccountForm')),
  ContactUsExtra: dynamic(() => import('_components/organisms/marketing/ContactUsExtra')),
  ContactUsForm: dynamic(() => import('_components/organisms/marketing/ContactUsForm')),
  Features: dynamic(() => import('_components/organisms/marketing/Features')),
  ForgotPasswordForm: dynamic(() => import('_components/organisms/marketing/ForgotPasswordForm')),
  HowItWorks: dynamic(() => import('_components/organisms/marketing/HowItWorks')),
  LoginForm: dynamic(() => import('_components/organisms/marketing/LoginForm')),
  LogoWall: dynamic(() => import('_components/organisms/marketing/LogoWall')),
  ProductOverview: dynamic(() => import('_components/organisms/marketing/ProductOverview')),
  ResetPasswordForm: dynamic(() => import('_components/organisms/marketing/ResetPasswordForm')),
  RichText: dynamic(() => import('_components/organisms/marketing/RichText')),
  UspBar: dynamic(() => import('_components/organisms/marketing/UspBar'))
};

// used as a component registry. This is used to allow the CMS to return an array of components to render, which this hook matches via the ID & returns. Most of the code above is just to define the TS interfaces (to avoid using 'any') & dynamically import the components 
const useComponent = (id: string) => {

  // create an array of all the components, in TS it's better to match from array than object
  const mapped = Object.entries(dynamicComponents).map(([key, val]) => ({
    id: key, 
    component: val
  }));

  // find the component by its ID
  const target = mapped.find(item => item.id === id);
  // if we get a match, use it. Otherwise, return null 
  const component = target ? target.component : null;

  return component;

};

export default useComponent;
