export class Unit {
  constructor(
    public id: string,
    public health: number,
    public power: number,
    public title: string,
    public avatar: string
  ) {
  }

  public isDied(): boolean {
    return this.health === 0;
  }
}
