import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Button } from '_atoms';
import { DeleteEmployee, PraiseHistory, TeamHappiness, TeamLearning, TeamMember, TeamSurveys } from '_molecules';
import { defaultUser } from '_context';
import { useFetch, useRefresh } from '_hooks';
import { delay } from '_utils';
import styles from './TeamProfile.module.scss';

interface IProps {
  memberId?: string | string[];
}

// used to house the various components in the employee profile page on the admin dashboard (if the employee has activated their account). If not, we render a screen prompting the admin to resend the invite email
const TeamProfile = ({ memberId }: IProps) => {

  const router = useRouter();
  const { env, fetchData, postData } = useFetch();
  const [active, setActive] = useState<boolean>(false);
  const { refresh, bumpRefresh } = useRefresh();
  const [loaded, setLoaded] = useState<boolean>(false);
  const [member, setMember] = useState<IUserIndex | null>(null);
  const [members, setMembers] = useState<IUser[] | null>(null);
  const [deletedMember, setDeletedMember] = useState<boolean>(false);
  const [selectedMember, setSelectedMember] = useState<IUser>(defaultUser);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [invited, setInvited] = useState<boolean>(false);

  // handle when the admin confirms deletion of an inactive employee - hide the confimation modal & redirect the admin to the employee list page
  const handleMemberDelete = (): void => {

    setDeletedMember(true);
    setModalOpen(false);

  };

  // handle when the admin chooses to delete an inactive employee - show the confimation modal 
  const handleMemberSelect = (): void => {

    const target = members?.find(item => item.id === parseInt(`${memberId}`));

    // if we've got the employee data via the ID, store locally & launch modal
    if (target) {
      
      setSelectedMember(target);
      setModalOpen(true);
    
    }

  };

  // handle when an admin chooses to resend the invite email to an inactive employee
  const sendInvite = () => {

    if (env) {

      const data = { memberId };

      postData('/members/invite', data).then(response => {

        if (response?.invited) setInvited(true);
  
      });
    
    }
  
  };

  useEffect(() => {

    // fetch employee data on mount
    if (env) {

      fetchData(`/members/${memberId}`).then(response => {

        if (response?.email) setMember(response);
  
        if (response?.isActive) setActive(true); 
  
      });
  
      fetchData('/members/all').then(response => {
  
        if (Array.isArray(response)) setMembers(response);
  
      });

    }

  }, [env]);

  useEffect(() => {

    // when the delete modal closes, wait for the animation to play then reset the UI (& optionally redirect the admin to the employee list page if they confirmed delete)
    if (!modalOpen) delay(250).then(() => {

      setSelectedMember(defaultUser);
      bumpRefresh();

      if (deletedMember) router.push('/admin/team');

    });

  }, [modalOpen]);

  useEffect(() => {

    // if we have member data, wait for content to load then hide the loading spinner
    if (member) delay(300).then(() => setLoaded(true));

  }, [member]);

  return (
    <section className={`dashboard-single card card--table spinner${!loaded ? ' spinning' : ''}`}>
      {active ? (
        <>
          <TeamMember memberId={memberId}
            classes={styles.details} />
          <article className={styles.training}>
            <h2 className="h4">Learning</h2>
            <TeamLearning memberId={memberId} />
          </article>
          <article className={styles.happiness}>
            <h2 className="h4">Happiness surveys</h2>
            <TeamHappiness memberId={memberId} />
          </article>
          <article className={styles.surveys}>
            <h2 className="h4">Surveys</h2>
            <TeamSurveys memberId={memberId} />
          </article>
          <PraiseHistory memberId={memberId}
            classes={styles.praise} />
        </>
      ) : (
        <>
          <header className={`${styles.header} padded`}>
            <h1 className="h4">{ member?.email }</h1>
            <div className="card__tasks">
              <button className="widget-link"
                onClick={handleMemberSelect}>
                Delete this user
              </button>
            </div>
          </header>
          <article className={styles.inactive}>
            <h2 className="h4">This user hasn’t activated their account yet</h2>
            <Button text={`Resen${invited ? 't' : 'd'} activation email`}
              disabled={invited}
              prominence="primary"
              classes={invited ? 'disabled disabled--block' : ''}
              emitClick={sendInvite} />
          </article>
          <DeleteEmployee key={refresh * 5}
            employee={selectedMember}
            launch={modalOpen}
            emitClose={() => setModalOpen(false)}
            emitDeleted={handleMemberDelete} />
        </>
      )}
    </section>
  );

};

export default TeamProfile;
