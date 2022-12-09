import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { Button, Card, Error, Textarea } from '_atoms';
import PraisePerson from './PraisePerson';
import SelectBadge from './../global/SelectBadge';
import TabbedForm from './../global/TabbedForm';
import { useFetch, useRefresh } from '_hooks';
import { delay, isCurrentTarget } from '_utils';
import styles from './PraiseWidget.module.scss';

interface IProps {
  classes?: string;
}

const Modal = dynamic(import('./../global/Modal'));

const defaultEmpty = 'Sorry, there was a problem fetching the members. Please try again later';
const inputLabel = 'Write a message';
const timeout = 600000;

// used in the employee dashboard to allow an employee to praise a colleague. They select a coworker, praise badge & then write their message before submitting 
const PraiseWidget = ({ classes }: IProps) => {

  const { register, errors, handleSubmit } = useForm({ mode: 'onSubmit' });
  const { error, errorMessage, submitted, setSubmitted, postData } = useFetch();
  const { refresh, bumpRefresh } = useRefresh();
  const [selectedBadge, setSelectedBadge] = useState<IBadge | null>(null);
  const [selectedMember, setSelectedMember] = useState<IUser | null>(null);
  const [emptyMembers, setEmptyMembers] = useState<string>('');
  const [membersOpen, setMembersOpen] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  // save the selected badge & hide the modal
  const handleSelect = (badge: IBadge) => {

    setSelectedBadge(badge);
    setModalOpen(false);

  };

  // handle submit of praise message 
  const onSubmit = (submitted: IPraiseMessage) => {

    // create & format data object with message, colleague & badge 
    const data = {
      ...submitted,
      typeId: selectedBadge?.id,
      recipientIds: selectedMember?.id.toString()
    };

    // post object to the API
    postData('/praise/give', data).then(response => {

      if (response?.success) { 

        setSubmitted(true);

        delay(timeout).then(() => {
          
          bumpRefresh();
          setSubmitted(false);
        
        });

      }

    });

  };

  return (
    <>
      <Card heading="Give praise to a teammate"
        icon="praise"
        loading={!selectedBadge && !error}
        classes={`${styles.root}${classes ? ' ' + classes : ''}`}>
        <Link href="/profile#praise">
          <a className={`${styles.view} text-link`}>See my praise</a>
        </Link>
        <div className={styles.wrapper}>
          <TabbedForm success={submitted}
            info={`We've sent your praise${selectedMember?.name ? ' to ' + selectedMember.name.split(' ')[0] : ''}`}>
            <form className={`${styles.form} form form--standard`}
              onClick={(e) => isCurrentTarget(e) ? setMembersOpen(false) : undefined}
              onSubmit={handleSubmit(onSubmit)}>
              <fieldset>
                <legend>Give praise to a teammate</legend>
                <div className={styles.actions}
                  onClick={(e) => isCurrentTarget(e) ? setMembersOpen(false) : undefined}>
                  <button type="button" 
                    className={styles.selected}
                    onClick={() => setModalOpen(true)}>
                    {selectedBadge?.badge.src ? (
                      <img src={selectedBadge.badge.src} 
                        alt={selectedBadge.badge.alt || selectedBadge.name} />
                    ) : (
                      <img src="http://www.staging.prosperex.com.au/public/badges/winner.svg" 
                        alt="Winner badge" />
                    )}
                  </button>
                  <PraisePerson isEmpty={emptyMembers.length > 0}
                    refresh={refresh}
                    toggleOpen={membersOpen}
                    emitEmpty={(empty) => setEmptyMembers(empty ? defaultEmpty : '')}
                    emitSelect={(member) => setSelectedMember(member)} />
                  <Textarea key={refresh}
                    name="message"
                    label={inputLabel} 
                    placeholder={inputLabel} 
                    hideLabel={true}
                    hasError={errors.message}
                    errorMsg={errors.message?.message}
                    register={register} 
                    required={true} />
                </div>
              </fieldset>
              <Button text={`Praise ${selectedMember?.name.split(' ')[0] || ''}`}
                type="submit" />
              <Error message={emptyMembers ? emptyMembers : `${errorMessage} (${error})`}
                expanded={!!error || emptyMembers.length > 0}
                persist={true} />
            </form>
          </TabbedForm>
        </div>
      </Card>
      <Modal launch={modalOpen}
        classes={`${styles.badges} modal`}
        emitClose={() => setModalOpen(false)}>
        <h2 className="h4">Choose a badge to praise with</h2>
        <SelectBadge refresh={refresh}
          emitDefault={(badge) => setSelectedBadge(badge)}
          emitSelect={(badge) => handleSelect(badge)} />
      </Modal>
    </>
  );

};

export default PraiseWidget;
