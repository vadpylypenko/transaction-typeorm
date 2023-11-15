import { DataSource, QueryRunner } from 'typeorm';
import { TypeOrmTransactionErrorException } from '../exception';
import { TypeOrmTransactionInterface } from '../interface';

export class TypeOrmTransactionService implements TypeOrmTransactionInterface {
  /**
   * Constructor.
   * 
   * @param dataSource - The TypeOrm's DataSource instance.
   */
  constructor(private dataSource: DataSource) {}

  /**
   * @inheritdoc
   */
  async transaction<T>(
    cb: (queryRunner: QueryRunner) => Promise<T>,
  ): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await cb(queryRunner);

      await queryRunner.commitTransaction();

      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();

      throw new TypeOrmTransactionErrorException(e.message);
    } finally {
      await queryRunner.release();
    }
  }
}
