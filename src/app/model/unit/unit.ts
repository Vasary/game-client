export type Team = 'Heroes' | 'Villains';

export class Unit {
  damaged: number | null = null;

  timer: null | ReturnType<typeof setTimeout> = null;

  constructor(
    public id: string,
    public health: number,
    public power: number,
    public title: string,
    public avatar: string,
    public team: Team
  ) {
  }

  public isDied(): boolean {
    return this.health <= 0;
  }

  public applyDamage(value: number): void {
    if (this.timer !== null) {
      clearTimeout(this.timer)
      this.damaged = null;
    }

    this.damaged = value;
    this.timer = setTimeout(() => this.damaged = null, 500);
  }
}
