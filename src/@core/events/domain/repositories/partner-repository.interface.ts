import { IRepository } from '../../../shared/domain/repository-interface';
import { Partner } from '../entities/partner.entity';

export interface IPartnerRepository extends IRepository<Partner> {}
