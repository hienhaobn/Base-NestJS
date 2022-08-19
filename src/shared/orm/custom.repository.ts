import { EntityRepository, Repository } from 'typeorm';

@EntityRepository()
export class CustomRepository<T> extends Repository<T> {}
