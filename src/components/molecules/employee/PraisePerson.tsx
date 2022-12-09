import { useCallback, useContext, useEffect, useState } from 'react';
import { DefaultAvatar } from '_atoms';
import { SpaceContext } from '_context';
import { useFetch } from '_hooks';
import { filterInactiveUsers, globals, isCurrentTarget, lazyload, sortUsers } from '_utils';
import styles from './PraisePerson.module.scss';

interface IProps {
  isEmpty: boolean;
  refresh: number;
  toggleOpen: boolean;
  emitEmpty: (empty: boolean) => void;
  emitSelect: (member: IUser) => void;
}

// used to allow a employee to select a colleague to send praise to
const PraisePerson = ({ isEmpty, refresh, toggleOpen, emitEmpty, emitSelect }: IProps) => {

  const { env, error, fetchData } = useFetch();
  const { space, hasSpaceData } = useContext(SpaceContext);
  const [members, setMembers] = useState<IUser[] | null>(null);
  const [selectedMember, setSelectedMember] = useState<IUser | null>(null);
  const [listOpen, setListOpen] = useState<boolean>(false);

  // memoize the toggle for performance 
  const toggleList = useCallback(() => {

    setListOpen(v => !v);

  }, []);

  // called when a user clicks a colleague's name
  const selectMember = (member: IUser) => {

    // save who they clicked
    setSelectedMember(member);
    // hide the list
    setListOpen(false);

    // emit to be handled in parent 
    emitSelect(member);

  };

  useEffect(() => {

    // grab the members in the space, handling scenario where there aren't any 
    if (env && hasSpaceData) {

      fetchData('/members/all?activeOnly=1').then(response => {

        if (response?.length > 0) {

          //const filtered = filterInactiveUsers(response).filter(({ id }: IUser) => id !== space.user.id);
          setMembers(sortUsers(response));
          //if (filtered) setMembers(sortUsers(filtered));

          emitEmpty(false);

        } else {

          setMembers([]);
          emitEmpty(true);

        }

      });

    }

  }, [env, space, hasSpaceData]);

  useEffect(() => {

    // when we get the member data or trigger a manual refresh, automatically select the first person in the list
    if (members) selectMember(members[0]);

  }, [members, refresh]);

  useEffect(() => {

    // ensure the selected colleague's avatar is loaded
    lazyload();

  }, [selectedMember]);

  useEffect(() => {

    // handle error 
    if (error) emitEmpty(true);

  }, [error]);

  useEffect(() => {

    // if parent wants to show or hide the list, handle it here
    setListOpen(toggleOpen);

  }, [toggleOpen]);

  return (
    <div className={`${styles.root}${listOpen ? ' ' + styles.expanded : ''}`}
      onClick={(e) => isCurrentTarget(e) ? setListOpen(false) : undefined}>
      {selectedMember && (
        <button type="button" 
          className={`${styles.avatar} spinner spinner--avatar spinning`}
          disabled={isEmpty}
          onClick={toggleList}>
          {selectedMember.avatar?.src ? (
            <img key={selectedMember.avatar.src} 
              src={globals.defaultSrc} 
              data-src={selectedMember.avatar.src} 
              alt={selectedMember.avatar.alt || selectedMember.name}
              className="b-lazy" />
          ) : (
            <DefaultAvatar user={selectedMember} />
          )}
        </button>
      )}
      {members && (
        <nav className={`${styles.members}${listOpen ? ' ' + styles.shown : ''}`}>
          <ul>
            {members?.map((member, i) => {

              const { name } = member;

              return (
                <li key={`${name}-${i}`}>
                  <button type="button"
                    className="text--medium"
                    onClick={() => selectMember(member)}>
                    { name }
                  </button>
                </li>
              );

            })}
          </ul>
        </nav>
      )}
    </div>
  );

};

export default PraisePerson;
