export let SOCKET = {
  socket: null,
};

export const GlobalSocketSet = (socketObj) => {
  SOCKET = socketObj;
};
