export declare class InMemTestService {
    cacheableTask1(): Promise<boolean>;
    cacheableTask2(): Promise<boolean>;
    notCacheableTask(): Promise<boolean>;
    cacheableTaskWithArrayParam(param: any[]): Promise<string>;
}
