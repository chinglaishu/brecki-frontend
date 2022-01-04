import { User } from "../../type/common";

export const getUseUser = (users: User[], currentUser: User) => {
  for (let i = 0 ; i < users.length ; i++) {
    if (users[i].id !== currentUser.id) {
      return users[i];
    }
  }
  return null;
};
