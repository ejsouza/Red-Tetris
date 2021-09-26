import { App } from './app';
import { AuthController } from './controllers/auth';
import { TokenController } from './controllers/token';
import { UserController } from './controllers/user';
import { PasswordController } from './controllers/password';

const app = new App([
  new AuthController(),
  new TokenController(),
  new UserController(),
  new PasswordController(),
]);

if (require.main === module) {
  app.listen();
}

export { app };
