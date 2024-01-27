# Remix RockSpec Stack

> Deprecated

![The Remix RockSpec Stack](https://github.com/ShafSpecs/rockspec-stack-example/blob/main/public/images/rockspec-image.png)

Learn more about [Remix Stacks](https://remix.run/stacks).

```
npx create-remix --template ShafSpecs/rockspec-stack
```

## What's in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Production-ready [PostgreSQL Database](https://www.postgresql.org/)
- Fully functional [Progressive Web App](https://web.dev/progressive-web-apps/) native capabilities includng automatic caching, network detection and more. 
- Email/Password Authentication with [cookie-based sessions](https://remix.run/docs/en/v1/api/remix#createcookiesessionstorage)
- Database ORM with [Prisma](https://prisma.io)
- Styling with [Tailwind](https://tailwindcss.com/)
- End-to-end testing with [Cypress](https://cypress.io)
- Code formatting with [Prettier](https://prettier.io)
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

Not a fan of bits of the stack? Want to improve it? Fork it, change it, and create a PR!

## Getting Started

- Buckle your seatbelts and get ready to get blown by Remix!

## Development

- Create a `.env` file and copy the content from the `.env.example` file, delete the `.env.example` file afterwards.

- Provision the database and connect it to the app using the `DATABASE_URL` environment variable.

> Skip if you're using Fly Postgres database (more info below).

> *If you don't have Postgres database already, you could quickly provision one for free using [Railway](https://railway.app?referralCode=Q7x99X).*

- Set up Prisma and connect it to the database:
  ```sh
  npm run prisma
  ```

- Generate VAPID Keys for the Push API subscription service:
  ```sh
  npm run push-keys
  ```
  Store the Public key in the `VAPID_PUBLIC_KEY` and the private key in the `VAPID_PRIVATE_KEY` environment variable.

- Start dev server:

  ```sh
  npm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack progressive web app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

- creating users, and logging in and out [./app/models/user.server.ts](./app/models/user.server.ts)
- user sessions, and verifying them [./app/session.server.ts](./app/session.server.ts)
- creating, and deleting notes [./app/models/note.server.ts](./app/models/note.server.ts)
- client-side pwa APIs [./app/utils/client/pwa-utils.client.ts](./app/utils/client/pwa-utils.client.ts)
- server-side pwa APIs [./app/utils/server/pwa-utils.server.ts](./app/utils/server/pwa-utils.server.ts)
- pwa manifest [./app/routes/resources/manifest{.}json.ts](./app/routes/resources/manifest[.]json.ts)

> *For more info on building a powerful Progressive Web App, checkout [`remix-pwa`](https://github.com/ShafSpecs/remix-pwa)*

## Deployment

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly create rockspec-stack-template
  fly create rockspec-stack-template-staging
  ```

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app rockspec-stack-template
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app rockspec-stack-template-staging
  ```

  > **Note:** When creating the staging secret, you may get a warning from the Fly CLI that looks like this:
  >
  > ```
  > WARN app flag 'rockspec-stack-template-staging' does not match app name in config file 'rockspec-stack-template'
  > ```
  >
  > This simply means that the current directory contains a config that references the production app we created in the first step. Ignore this warning and proceed to create the secret.

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

- Add `VAPID_PUBLIC_KEY` and `VAPID_PRIVATE_KEY` environment variables to your fly secrets too:
  ```sh
  fly secrets set VAPID_PRIVATE_KEY=<VAPID_PRIVATE_KEY> --app rockspec-stack-template
  fly secrets set VAPID_PRIVATE_KEY=<VAPID_PRIVATE_KEY> --app rockspec-stack-template-staging

  fly secrets set VAPID_PUBLIC_KEY=<VAPID_PUBLIC_KEY> --app rockspec-stack-template
  fly secrets set VAPID_PUBLIC_KEY=<VAPID_PULIC_KEY> --app rockspec-stack-template-staging
  ```
  > *Set your `DATABASE_URL` this way too if you aren't using the Fly Postgres database*

- Create a persistent volume for the postgresql database for both your staging and production environments (*skip if you already set one up!*). Run the following:

  ```sh
  # Skip this part if you already have a non-Fly PostgreSQL database.
  fly postgres create --name blues-stack-template-db
  fly postgres attach --postgres-app rockspec-stack-template-db --app blues-stack-template

  fly postgres create --name blues-stack-template-staging-db
  fly postgres attach --postgres-app rockspec-stack-template-staging-db --app blues-stack-template-stagin
  ```

  > **Note:** You'll get the same warning for the same reason when attaching the staging database that you did in the `fly set secret` step above. No worries. Proceed!

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## Testing

### Cypress

We use Cypress for our End-to-End tests in this project. You'll find those in the `cypress` directory. As you make changes, add to an existing file or create a new file in the `cypress/e2e` directory to test your changes.

We use [`@testing-library/cypress`](https://testing-library.com/cypress) for selecting elements on the page semantically.

To run these tests in development, run `npm run test:e2e:dev` which will start the dev server for the app as well as the Cypress client. Make sure the database is running in docker as described above.

We have a utility for testing authenticated features without having to go through the login flow:

```ts
cy.login();
// you are now logged in as a new user
```

We also have a utility to auto-delete the user at the end of your test. Just make sure to add this in each test file:

```ts
afterEach(() => {
  cy.cleanupUser();
});
```

That way, we can keep your local db clean and keep your tests isolated from one another.


### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `npm run format` script you can run to format all files in the project.
