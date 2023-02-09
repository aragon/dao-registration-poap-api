import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: process.env.NODE_ENV !== 'production',
      introspection: process.env.NODE_ENV !== 'production',
      persistedQueries: false,
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
