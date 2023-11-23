# Dev-Dev News API

[https://dev-dev-api.onrender.com/](https://dev-dev-api.onrender.com/)

Dev-Dev News is a REST API which will connect with a front-end to serve all the relevant data for a social-news site similiar to hackernews and reddit.

## Prerequisites

Ensure you have the following versions of PostgreSQL and Node:

- **Node.js >= 16**
- **PostgreSQL >= 14.9**

## Setup

Follow these steps to setup your local environment:

1. Clone this repository

```
git clone https://github.com/mkawi/dev-dev-api.git
```

2. Install NPM packages

```
npm install
```

3. Create Dev & Test Environment Variables

```
touch .env.development && echo PGDATABASE=nc_news > .env.development
touch .env.test && echo PGDATABASE=nc_news_test > .env.test
```

4. Set up your local PostgreSQL databases

```
npm run setup-dbs
npm run seed
```

5. Run test suites to ensure everything is setup correctly

```
npm run test
```

6. Finally, run the project locally (development mode)

```
npm run start
```
