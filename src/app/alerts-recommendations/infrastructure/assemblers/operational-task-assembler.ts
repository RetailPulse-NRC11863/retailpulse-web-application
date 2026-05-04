import { BaseAssembler } from '../../../shared/infrastructure/http/base-assembler';
import { OperationalTask } from '../../domain/model/operational-task.entity';
import { OperationalTaskResource } from '../resources/operational-task-resource';
import { OperationalTaskResponse } from '../responses/operational-task-response';

export class OperationalTaskAssembler implements BaseAssembler<OperationalTask, OperationalTaskResource, OperationalTaskResponse> {
  toEntityFromResource(resource: OperationalTaskResource): OperationalTask {
    return new OperationalTask({
      id: resource.id,
      title: resource.title,
      description: resource.description,
      priority: resource.priority,
      status: resource.status,
      zoneId: resource.zoneId,
      zoneName: resource.zoneName,
      alertId: resource.alertId,
      createdAt: resource.createdAt
    });
  }

  toResourceFromEntity(entity: OperationalTask): OperationalTaskResource {
    return {
      id: entity.id,
      title: entity.title,
      description: entity.description,
      priority: entity.priority,
      status: entity.status,
      zoneId: entity.zoneId,
      zoneName: entity.zoneName,
      alertId: entity.alertId,
      createdAt: entity.createdAt.toISOString()
    };
  }

  toEntitiesFromResponse(response: OperationalTaskResponse): OperationalTask[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
