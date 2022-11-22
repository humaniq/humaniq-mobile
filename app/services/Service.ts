export abstract class Service {
  protected readonly sentryCategoryPrefix: string;

  protected constructor(sentryCategoryPrefix: string) {
    this.sentryCategoryPrefix = sentryCategoryPrefix;
  }
}
