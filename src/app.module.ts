import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { PoapEventModule } from './poap-event/poap-event.module';
import { PoapModule } from './poap/poap.module';
import { PoapAuthModule } from './poap-auth/poap-auth.module';
import { UserModule } from './user/user.module';
import { DefenderModule } from './defender/defender.module';
import { PoapClaimCodeModule } from './poap-claim-code/poap-claim-code.module';
import { PoapClaimCodeEventModule } from './poap-claim-code-event/poap-claim-code-event.module';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './user/user.middleware';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      context: ({ req, res }) => ({ req, res }),
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      persistedQueries: false,
      cors: {
        origin: _corsOrigin(),
        credentials: true,
      },
    }),
    PrismaModule,
    PoapEventModule,
    PoapEventModule,
    PoapModule,
    PoapAuthModule,
    UserModule,
    DefenderModule,
    PoapClaimCodeModule,
    PoapClaimCodeEventModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('graphql');
  }
}

function _corsOrigin() {
  // Disable localhost in production
  return [...(process.env.NODE_ENV !== 'production' ? [/localhost:3001/] : [])];
}
