export class OperationalAlertCreated {
  constructor(
    public readonly alertId: string,
    public readonly zoneId: string,
    public readonly priority: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class OperationalAlertEscalated {
  constructor(
    public readonly alertId: string,
    public readonly newPriority: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class OperationalAlertResolved {
  constructor(
    public readonly alertId: string,
    public readonly resolvedByStaffId: string | null,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class OperationalTaskAssigned {
  constructor(
    public readonly taskId: string,
    public readonly staffId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}
