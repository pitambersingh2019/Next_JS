import { useState } from 'react';
import intlTelInput from 'intl-tel-input';
import 'intl-tel-input/build/js/utils.js';

// due to the dependency on the 'intl-tel-input' plugin, this hook was created to handle its nuances & extract this logic away from components which aren't bothered about it 
const usePhone = () => {
  
  const [instance, setInstance] = useState<intlTelInput.Plugin | null>(null);

  // define validation messages 
  const phoneValidation = { 
    required: 'We need your phone number to keep in touch. Please try again',
    validate: () => instance?.isValidNumber() || `That number doesn't look quite right. Please check and try again`
  };

  const initPhone = (ref: Element) => {
    
    // create & configure an instance of the plugin 
    setInstance(intlTelInput(ref, {
      preferredCountries: ['au', 'gb'],
      separateDialCode: true
    }));
  
  };

  return {
    instance,
    phoneValidation,
    initPhone
  };

};

export default usePhone;