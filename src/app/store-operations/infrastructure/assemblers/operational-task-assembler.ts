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
      zoneId: resource.zoneId || '',
      zoneName: resource.zoneName || (resource.zoneId ? `Zone ${resource.zoneId}` : 'Store floor'),
      alertId: resource.alertId || '',
      productId: resource.productId,
      productName: resource.productName || (resource.productId ? `Product ${resource.productId}` : ''),
      source: resource.source,
      triggerReason: resource.triggerReason,
      createdAt: resource.createdAt || new Date().toISOString()
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
      productId: entity.productId,
      productName: entity.productName,
      source: entity.source,
      triggerReason: entity.triggerReason,
      createdAt: entity.createdAt.toISOString()
    };
  }

  toEntitiesFromResponse(response: OperationalTaskResponse): OperationalTask[] {
    return response.content.map(resource => this.toEntityFromResource(resource));
  }
}
