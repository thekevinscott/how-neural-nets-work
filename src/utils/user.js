const KEY = "@how-neural-nets-work/user";

export const get = () => {
  try {
    return JSON.parse(localStorage[KEY]);
  } catch(err) {
    return {};
  }
};

export const save = (payload = {}) => {
  const user = get();
  try {
    localStorage[KEY] = JSON.stringify({
      ...user,
      ...payload,
    });
  } catch(err) {
  }
};
