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
import { AdminModule } from './admin/admin.module';
import { PendingDaoRegistrySyncModule } from './pending-dao-registry-sync/pending-dao-registry-sync.module';
import { StatisticsModule } from './statistics/statistics.module';

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
        origin: corsOrigin(),
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
    AdminModule,
    PendingDaoRegistrySyncModule,
    StatisticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('graphql');
  }
}

export function corsOrigin() {
  return [
    /\.aragon\.org$/,
    ...(process.env.NODE_ENV !== 'production' ? [/localhost:\d{4}/] : []),
  ];
}
