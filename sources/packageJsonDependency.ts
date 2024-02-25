import { Pre } from "./pre";

export class PackageJsonDependency
{
    private readonly name: string;
    private readonly version: string;

    private constructor(name: string, version: string)
    {
        Pre.condition.assertNotUndefinedAndNotNull(name, "name");
        Pre.condition.assertNotUndefinedAndNotNull(version, "version");

        this.name = name;
        this.version = version;
    }

    public static create(name: string, version: string): PackageJsonDependency
    {
        return new PackageJsonDependency(name, version);
    }

    public getName(): string
    {
        return this.name;
    }

    public getVersion(): string
    {
        return this.version;
    }
}