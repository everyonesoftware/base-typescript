import { Pre } from "./pre";

/**
 * Details about a NPM package.
 */
export class NpmPackageDetails
{
    private readonly name: string;
    private readonly description: string;
    private readonly versions: string[];

    private constructor(name: string, description: string, versions: string[])
    {
        Pre.condition.assertNotEmpty(name, "name");
        Pre.condition.assertNotEmpty(description, "description");
        Pre.condition.assertNotUndefinedAndNotNull(versions, "versions");
        Pre.condition.assertGreaterThanOrEqualTo(versions.length, 0, "versions.length");

        this.name = name;
        this.description = description;
        this.versions = versions;
    }

    public static create(name: string, description: string, versions: string[]): NpmPackageDetails
    {
        return new NpmPackageDetails(name, description, versions);
    }

    public getName(): string
    {
        return this.name;
    }

    public getDescription(): string
    {
        return this.description;
    }

    public getVersions(): string[]
    {
        return this.versions;
    }
}