import * as assert from "assert";
import { FetchHttpClient, HttpClient, HttpMethod, HttpRequest, HttpResponse, PreConditionError } from "../sources";

suite("fetchHttpClient.ts", () =>
{
    suite("FetchHttpClient", () =>
    {
        test("create()", () =>
        {
            const client: FetchHttpClient = FetchHttpClient.create();
            assert.notStrictEqual(client, undefined);
        });

        suite("sendRequest(HttpRequest)", () =>
        {
            function sendRequestErrorTest(httpRequest: HttpRequest, expected: Error): void
            {
                test(`with ${JSON.stringify(httpRequest)}`, async () =>
                {
                    const client: HttpClient = FetchHttpClient.create();
                    await assert.rejects(async () => await client.sendRequest(httpRequest),
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
                test(`with ${JSON.stringify(request)}`, async () =>
                {
                    const client: HttpClient = FetchHttpClient.create();
                    const response: HttpResponse = await client.sendRequest(request);
                    assert.notStrictEqual(response, undefined);
                    assert.strictEqual(response.getStatusCode(), expectedStatusCode);
                    const jsonBody: any = await response.getBodyAsJson();
                    delete jsonBody.headers["X-Amzn-Trace-Id"];
                    delete jsonBody["origin"];
                    assert.deepStrictEqual(jsonBody, expectedBody);
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