import { IUser, socketUser } from "./../types/types";

let loggedInUsers: Record<string, socketUser> = {};

export const addToLoggedIn = (socketId: string, user: IUser) => {
  const newUser = { ...user, socketId };

  loggedInUsers[socketId] = newUser;
};

export const logOut = (socketId: string) => {
  const user = { ...loggedInUsers[socketId] };

  delete loggedInUsers[socketId];

  return user;
};

export const getFriends = (userIds: string[]) => {
  const friends: socketUser[] = [];

  for (const key in loggedInUsers) {
    if (userIds.includes(loggedInUsers[key]._id)) {
      friends.push(loggedInUsers[key]);
    }
  }

  return friends;
};

// export const getOnlineFriends = (ids: []) => {};

export const getAllUsers = () => {
  return loggedInUsers;
};
