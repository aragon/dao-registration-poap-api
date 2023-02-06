import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { PoapEventModule } from './poap-event/poap-event.module';

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
    PoapEventModule
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
