export class ZoneId {
  constructor(public readonly value: string) {
    if (!value) throw new Error('ZoneId cannot be empty');
  }

  equals(other: ZoneId): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
