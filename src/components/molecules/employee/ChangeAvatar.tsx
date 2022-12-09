import { useContext, useEffect, useState } from 'react';
import { Error, UserAvatar } from '_atoms';
import { SpaceContext } from '_context';
import { useFetch } from '_hooks';
import { lazyload } from '_utils';
import styles from './ChangeAvatar.module.scss';

interface IValidation {
  valid: boolean;
  size: number | null;
  width: number | null;
  height: number | null;
}

const defaultValidation: IValidation = {
  valid: true,
  size: null,
  width: null,
  height: null
};

// used to allow the employee to update their avatar on their profile page
const ChangeAvatar = () => {

  const { postData } = useFetch();
  const { space, saveSpace } = useContext(SpaceContext);
  const [files, setFiles] = useState<FileList | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [validation, setValidation] = useState<IValidation>(defaultValidation);
  const [message, setMessage] = useState<string>('');

  // use specific validation messaging to the user knows why their selected image file was rejected 
  const getMessage = (): string => {

    let message = 'Please make sure the photo is ';

    switch (true) {

      case !!validation.size:
        message += 'less than 5MB';
        break;

      case !!validation.width && !!validation.height:
        message += 'more than 300x300px';
        break;

      case !!validation.width:
        message += 'more than 300px wide';
        break;

      case !!validation.height:
        message += 'more than 300px tall';
        break;

      default:
        break;

    }

    return message;

  };

  // check the selected image file to make sure it's less than 5MB & larger than 300x300px 
  const validatePhoto = (file: File): Promise<IValidation> => {

    return new Promise((resolve) => {
  
      // create element on the fly
      const img = document.createElement('img');
  
      // set its src to be that passed to the method
      img.src = URL.createObjectURL(file);
  
      img.onload = () => {
  
        // tidy up as this is no longer needed
        window.URL.revokeObjectURL(img.src);
  
        // round up the file size to get the value in MB 
        const size = Math.ceil(file.size / 1024 / 1024);
        const width = img.width;
        const height = img.height;

        // create a fresh validation object so that previous values are wiped 
        const response: IValidation = { ...defaultValidation };
  
        // image is bigger than 5MB
        if (size > 5) {
  
          response.valid = false;
          // store its size to be used to match the validation message in the getMessage() method 
          response.size = size;
  
        }
  
        // image is smaller than 300x300px
        if (width < 300 || height < 300) {
  
          response.valid = false;
          // store its dimensions to be used to match the validation message in the getMessage() method 
          response.width = width;
          response.height = height;
  
        }
  
        // return the validation object 
        resolve(response);
  
      };
  
    });
  
  };

  useEffect(() => {

    // when the file input's value changes, make sure there's a file to use 
    if (files?.length) {

      // reset the validation
      setValidation(defaultValidation);

      // get the last file (always the last in the array)
      const file = files[files.length - 1];

      // check the file
      validatePhoto(file).then(result => {

        // reset the preview filepath
        setPreview('');
        // update the validation object
        setValidation(result);

        // if it's valid we can post to the API 
        if (result.valid) {

          // this endpoint needs a different data format to the standard JSON.stringify() body
          const data = new FormData();

          data.append('file', file);

          // let the hook know that we've already porcessed the data as the third argument 
          postData('/profile/change-photo', data, true).then(response => {

            // if we've successfully updated their avatar, update the preview filepath
            if (response?.success && response?.avatar.src) setPreview(response.avatar.src);
      
          });

        }

      });

    }

  }, [files]);

  useEffect(() => {

    // we have a new avatar uploaded
    if (preview) {

      // use the current space data, but overwrite the avatar.src value
      const updated: ISpace = { 
        ...space, 
        user: { 
          ...space.user, 
          avatar: { 
            src: preview, 
            alt: 'New avatar' 
          } 
        }
      };

      // as this is all stored in the context, it will refresh everywhere that's subscribed to it (e.g. in the header)
      saveSpace(updated);
      // call lazyload to ensure that our new image is loaded properly 
      lazyload();

    }

  }, [preview]);

  useEffect(() => {

    // whenever the validation object changes, we need to make sure the validation message is up to date 
    validation.valid
      ? setMessage('')
      : setMessage(getMessage());

  }, [validation]);
  
  return (
    <label className={styles.root}>
      <span className="label text--small">Avatar</span>
      <div className={`${styles.wrapper} spinner spinner--avatar spinning`}>
        <UserAvatar classes={styles.avatar} />
      </div>
      <input type="file" 
        accept="image/jpeg, image/png, .heif"
        onChange={(e) => setFiles(e.currentTarget.files)} />
      <span className="text-link text--small">Choose a photo</span>
      <Error message={message}
        expanded={!validation.valid}
        persist={true} />
    </label>
  );

};

export default ChangeAvatar;
