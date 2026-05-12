export class ShelfLocation {
  constructor(public readonly aisle: string, public readonly shelf: string) {}

  toString(): string {
    return `${this.aisle} - ${this.shelf}`;
  }

  equals(other: ShelfLocation): boolean {
    return this.aisle === other.aisle && this.shelf === other.shelf;
  }
}
