import { BaseEntity } from '../../../shared/domain/model/base-entity';

export class Recommendation implements BaseEntity {
  id: string;
  title: string;
  description: string;
  priority: string;
  type: string;
  createdAt: Date;

  constructor(data: {
    id: string;
    title: string;
    description: string;
    priority: string;
    type: string;
    createdAt: Date | string;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.priority = data.priority;
    this.type = data.type;
    this.createdAt = new Date(data.createdAt);
  }
}
