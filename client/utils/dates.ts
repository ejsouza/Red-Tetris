const tokenExpired = (token: string): boolean => {
  let payload = atob(token.split('.')[1]);
  payload = payload.split(':')[3];
  const exp = payload.substring(0, payload.length - 1);
  let now = Date.now().toString();
  now = now.substring(0, now.length - 3);
  return +now > +exp;
};

export { tokenExpired };
