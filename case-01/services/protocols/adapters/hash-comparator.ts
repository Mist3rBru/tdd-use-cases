export interface IHashComparator {
  compare (data: string, hash: string): Promise<boolean>
}