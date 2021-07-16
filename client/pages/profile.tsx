import { useEffect, useState } from 'react';
import { getUserById } from '../core/user';

const Profile = () => {
  const [user, setUser] = useState(undefined);
  useEffect(() => {
    getUserById().then((u) => {
      console.log(`GOT HERE => ? ${u}`);
      if (!u) {
        console.log(`something went wrong.`);
      } else {
        u.json().then((user) => {
          console.log(user);
          setUser(user);
        });
      }
    });
  }, []);
  return (
    <>
      Profile <div>{user}</div>
    </>
  );
};

export default Profile;
