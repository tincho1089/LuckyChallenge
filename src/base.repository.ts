export interface BaseRepository<T> {
  findById?(id: number, trx?: any): Promise<T>;
  findAll?(): Promise<T[]>;
  findByName?(name: string): Promise<T[]>;
}
