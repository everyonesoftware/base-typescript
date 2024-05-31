import { HttpClient } from "./httpClient";
import { NpmClient } from "./npmClient";
import { NpmPackageDetails } from "./npmPackageDetails";
import { HttpClientDecorator } from "./httpClientDecorator";
import { Pre } from "./pre";
import { HttpResponse } from "./httpResponse";
import { NotFoundError } from "./notFoundError";
import { Iterator } from "./iterator";
import { PackageJson } from "./packageJson";
import { DependencyUpdate } from "./dependencyUpdate";

/**
 * A {@link NpmClient} that uses a {@link HttpClient} to make its requests.
 */
export class HttpNpmClient extends HttpClientDecorator implements NpmClient, HttpClient
{
    public constructor(httpClient: HttpClient)
    {
        Pre.condition.assertNotUndefinedAndNotNull(httpClient, "httpClient");

        super(httpClient);
    }

    public static create(httpClient: HttpClient): HttpNpmClient
    {
        return new HttpNpmClient(httpClient);
    }

    public async getPackageDetails(packageName: string): Promise<NpmPackageDetails>
    {
        Pre.condition.assertNotEmpty(packageName, "packageName");

        const packageUrl: string = `https://registry.npmjs.org/${packageName}`;
        const response: HttpResponse = await this.get(packageUrl);
        if (response.getStatusCode() === 404)
        {
            throw new NotFoundError(`The package "${packageName}" doesn't exist at ${packageUrl}.`);
        }
        const bodyJson: any = await response.getBodyAsJson();
        const result: NpmPackageDetails = NpmPackageDetails.create(bodyJson.name, bodyJson.description, Object.keys(bodyJson.versions));

        return result;
    }
    
    public async findDependencyUpdates(packageJson: PackageJson): Promise<Iterator<DependencyUpdate>>
    {
        return NpmClient.findDependencyUpdates(this, packageJson);
    }
}