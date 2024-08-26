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

    // /**
    //  * Find the dependencies in the provided {@link PackageJson} that aren't using the latest version.
    //  * @param packageJson The {@link PackageJson} to check the dependencies for.
    //  */
    // public findDependencyUpdates(packageJson: PackageJson): Promise<Iterator<DependencyUpdate>>
    // {
    //     return NpmClient.findDependencyUpdates(this, packageJson);
    // }

    // /**
    //  * Use the provided {@link NpmClient} to find the dependencies in the provided {@link PackageJson} that aren't using the latest version.
    //  * @param npmClient The {@link NpmClient} to use to determine the latest version of the {@link PackageJson}'s dependencies.
    //  * @param packageJson The {@link PackageJson} to check the dependencies for.
    //  */
    // public static async findDependencyUpdates(npmClient: NpmClient, packageJson: PackageJson): Promise<Iterator<DependencyUpdate>>
    // {
    //     Pre.condition.assertNotUndefinedAndNotNull(npmClient, "npmClient");
    //     Pre.condition.assertNotUndefinedAndNotNull(packageJson, "packageJson");

    //     const result: List<DependencyUpdate> = List.create();

    //     for (const dependencyAndVersion of packageJson.iterateDependencies().await())
    //     {
    //         const dependencyName: string = dependencyAndVersion[0];
    //         const dependencyVersionString: string = dependencyAndVersion[1];
    //         const dependencyVersion: VersionNumber = VersionNumber.parse(dependencyVersionString).await();

    //         const dependencyDetails: NpmPackageDetails = await npmClient.getPackageDetails(dependencyName);
    //         const latestDependencyVersion: VersionNumber = Iterable.findMaximum(dependencyDetails.getVersions().map((version: string) => VersionNumber.parse(version).await())).await();

    //         if (dependencyVersion.lessThan(latestDependencyVersion))
    //         {
    //             result.add(DependencyUpdate.create(dependencyName, dependencyVersion.toString(), latestDependencyVersion.toString()));
    //         }
    //     }

    //     return result.iterate();
    // }
}