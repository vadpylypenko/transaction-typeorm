import { QueryRunner } from 'typeorm';

export interface TypeOrmTransactionInterface {
    /**
     * Executes the callback in the transaction of the TypeORM.
     * 
     * @param cb - The callback, executes in the scope of the transaction. The only persistence operation should be performed in the callback.
     * @throws TypeOrmTransactionErrorException
     * Throws an exception when the transaction fails.
     */
    transaction<T>(
        cb: (queryRunner: QueryRunner) => Promise<T>,
    ): Promise<T>
}