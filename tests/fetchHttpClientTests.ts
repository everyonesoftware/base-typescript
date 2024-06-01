import { FetchHttpClient, HttpClient, HttpMethod, HttpRequest, HttpResponse, PreConditionError, Test, TestRunner } from "../sources";
import { MochaTestRunner } from "./mochaTestRunner";

export function test(runner: TestRunner): void
{
    runner.testFile("fetchHttpClient.ts", () =>
    {
        runner.testType(FetchHttpClient.name, () =>
        {
            runner.testFunction("create()", (test: Test) =>
            {
                const client: FetchHttpClient = FetchHttpClient.create();
                test.assertNotUndefinedAndNotNull(client);
            });

            runner.testFunction("sendRequest(HttpRequest)", () =>
            {
                function sendRequestErrorTest(httpRequest: HttpRequest, expected: Error): void
                {
                    runner.testAsync(`with ${runner.toString(httpRequest)}`, async (test: Test) =>
                    {
                        const client: HttpClient = FetchHttpClient.create();
                        await test.assertThrowsAsync(() => client.sendRequest(httpRequest),
                            expected);
                    });
                }

                sendRequestErrorTest(
                    undefined!,
                    new PreConditionError(
                        "Expression: request",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
                sendRequestErrorTest(
                    null!,
                    new PreConditionError(
                        "Expression: request",
                        "Expected: not undefined and not null",
                        "Actual: null"));
                sendRequestErrorTest(
                    HttpRequest.create(),
                    new PreConditionError(
                        "Expression: request.getMethod()",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));
                sendRequestErrorTest(
                    HttpRequest.create()
                        .setMethod(HttpMethod.DELETE),
                    new PreConditionError(
                        "Expression: request.getUri()",
                        "Expected: not undefined and not null",
                        "Actual: undefined"));

                function sendRequestTest(request: HttpRequest, expectedStatusCode: number, expectedBody: unknown): void
                {
                    runner.testAsync(`with ${runner.toString(request)}`, runner.skip(false), async (test: Test) =>
                    {
                        const client: HttpClient = FetchHttpClient.create();
                        const response: HttpResponse = await client.sendRequest(request);
                        test.assertNotUndefinedAndNotNull(response);
                        test.assertEqual(response.getStatusCode(), expectedStatusCode);
                        const jsonBody: any = await response.getBodyAsJson();
                        delete jsonBody.headers["X-Amzn-Trace-Id"];
                        delete jsonBody["origin"];
                        test.assertEqual(jsonBody, expectedBody);
                    });
                }
                
                sendRequestTest(
                    HttpRequest.create()
                        .setMethod(HttpMethod.GET)
                        .setUri("https://httpbin.org/get"),
                    200,
                    {
                        "args": {},
                        "headers": {
                            "Accept": "*/*",
                            "Accept-Encoding": "br, gzip, deflate",
                            "Accept-Language": "*",
                            "Host": "httpbin.org",
                            "Sec-Fetch-Mode": "cors",
                            "User-Agent": "node",
                        },
                        "url": "https://httpbin.org/get"
                    });
            });
        });
    });
}
test(MochaTestRunner.create());