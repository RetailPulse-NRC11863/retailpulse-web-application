export class SubscriptionUpgraded {
  constructor(
    public readonly accountId: string,
    public readonly newPlanId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class SubscriptionRenewed {
  constructor(
    public readonly accountId: string,
    public readonly newRenewalDate: Date,
    public readonly timestamp: Date = new Date()
  ) {}
}

export class SubscriptionCanceled {
  constructor(
    public readonly accountId: string,
    public readonly timestamp: Date = new Date()
  ) {}
}
