import { InMemTestService } from "./service";
export declare class InMemTestController {
    private readonly testService;
    constructor(testService: InMemTestService);
    test1(): Promise<string>;
    test2(): Promise<"test2" | "modified test2">;
    test2bust(): Promise<void>;
    test3(): Promise<string>;
    test3param(param: string, query: string): Promise<string>;
    test3post(body: {
        [key: string]: any;
    }): Promise<string>;
    test3bust(): Promise<void>;
    test3RootKeyBust(): Promise<void>;
    partiallyCached(): Promise<string>;
    reverseOrderDecorator(): Promise<string>;
    test6(): Promise<string>;
    underTest6(): Promise<string>;
    test6bust(): Promise<void>;
}
