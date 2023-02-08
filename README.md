# DAO Registration POAP API

This is the API for the DAO Registration POAP. It is a NestJS API that uses Prisma to connect to a Postgres database.

`TODO: Add diagram`

## Setup

Prior running commands, make sure you have installed Docker and Postgres.

Install dependencies:

```bash
npm i
```

Copy the `.env.example` file to `.env` and fill in the values.

```bash
cp .env.example .env
```

## Building and running the app

```bash
docker-compose up -d
```

You can test that everything worked by visiting http://localhost:3000/health. You should see a JSON response with the following content:

```json
{
  "status": "healthy"
}
```

## Test

```bash
# e2e tests
$ npm run test:e2e
```

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
