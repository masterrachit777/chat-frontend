export const storage = {
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  removeUser: () => {
    localStorage.removeItem('user');
  },

//   getSessions: () => {
//     const sessions = localStorage.getItem('sessions');
//     return sessions ? JSON.parse(sessions) : [];
//   },

//   setSessions: (sessions) => {
//     localStorage.setItem('sessions', JSON.stringify(sessions));
//   },

//   removeSessions: () => {
//     localStorage.removeItem('sessions');
//   },
};