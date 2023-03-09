import { Test, TestingModule } from '@nestjs/testing';
import { EthereumResolver } from './ethereum.resolver';

describe('EthereumResolver', () => {
  let resolver: EthereumResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EthereumResolver],
    }).compile();

    resolver = module.get<EthereumResolver>(EthereumResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
