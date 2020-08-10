## About

This project has as main objective to simulate a clone of an api made in graphql for the website hackernews (https://news.ycombinator.com/).
This project was developed with the technologies graphql-yoga and prism as being the main pillars of the project and it counts with the registration flow of posts, the creation of users, the control of authentications and the necessary validations.

## Technologies

The project was developed using the following technologies:

- [nodejs](https://nodejs.org/)
- [prisma](https://www.prisma.io/)
- [graphql-yoga](https://github.com/prisma-labs/graphql-yoga)
- [bcryptjs](https://www.npmjs.com/package/bcryptjs)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)

## Minimal Requirements

- NodeJS 10.x
- NPM or Yarn

## Getting Started

<b>Cloning the repository:</b>

- `$ git clone https://github.com/JeffPatricio/hackernews_graphql.git`

<b>Download the dependences:</b>

<p>Go to the root of the project</p>

- `yarn`

<b>Executing</b>

- `npx prisma migrate up --experimental`
- `npx prisma generate`
- `yarn dev`
