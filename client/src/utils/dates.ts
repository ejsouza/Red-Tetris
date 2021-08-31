import jwtDecode, { JwtPayload } from 'jwt-decode';

const tokenExpired = (token: string): boolean => {
  // let payload = atob(token.split('.')[1]);
  // payload = payload.split(':')[3];
  // const exp = payload.substring(0, payload.length - 1);
  // let now = Date.now().toString();
  // now = now.substring(0, now.length - 3);
  // return +now > +exp;
  const decoded = jwtDecode<JwtPayload>(token);
  // const now = Date.now();
  if (decoded.exp) {
    let now = Date.now().toString();
    now = now.substring(0, now.length - 3);
    return +now > decoded.exp;
  }
  return true;
};

export { tokenExpired };
