import { HttpClient } from "./httpClient";
import { HttpNpmClient } from "./httpNpmClient";
import { NpmPackageDetails } from "./npmPackageDetails";

/**
 * A type that makes requests against the NPM registry.
 */
export abstract class NpmClient
{
    public static create(httpClient: HttpClient): HttpNpmClient
    {
        return HttpNpmClient.create(httpClient);
    }

    /**
     * Get details about a published package.
     * @param packageName The name of the package.
     */
    public abstract getPackageDetails(packageName: string): Promise<NpmPackageDetails>;
}