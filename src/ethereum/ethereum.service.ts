import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ethers } from 'ethers';
import { DaoRegistryFilterInput } from './dao-registry-filter.input';
import { DaoRegistryABI } from './dao-registry.abi';

@Injectable()
export class EthereumService {
  private alchemyProvider: ethers.providers.JsonRpcProvider;
  private contract: ethers.Contract;

  constructor(private readonly configService: ConfigService) {
    this.alchemyProvider = new ethers.providers.JsonRpcProvider(
      this.configService.get('ALCHEMY_RPC_URL'),
    );

    this.contract = new ethers.Contract(
      this.configService.get<string>('DAO_REGISTRY_CONTRACT_ADDRESS'),
      DaoRegistryABI,
      this.alchemyProvider,
    );
  }

  async getDAORegisteredEvents(daoRegistryFilterInput: DaoRegistryFilterInput) {
    const filter = this.contract.filters.DAORegistered(
      daoRegistryFilterInput.dao,
      daoRegistryFilterInput.creator,
    );
    const logs = await this.alchemyProvider.getLogs({
      ...filter,
      fromBlock: 0,
    });

    const abiInterface = new ethers.utils.Interface(DaoRegistryABI);

    const processedDaos = [];

    return logs
      .map((log) => {
        const logData = abiInterface.parseLog(log);
        const { creator, dao, subdomain } = logData.args;
        if (processedDaos.includes(dao)) return;
        return { creator, dao, subdomain };
      })
      .filter(Boolean);
  }
}
