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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      sortSchema: true,
      playground: process.env.DEPLOYMENT_ENV !== 'production',
      introspection: process.env.DEPLOYMENT_ENV !== 'production',
      persistedQueries: false,
    }),
    PrismaModule,
    PoapEventModule,
    PoapEventModule,
    PoapModule,
    PoapAuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
