import { JsonDataObject } from "./jsonDataObject";
import { Pre } from "./pre";

export class DependencyUpdate
{
    private readonly name: string;
    private readonly currentVersion: string;
    private readonly latestVersion: string;

    private constructor(name: string, currentVersion: string, latestVersion: string)
    {
        Pre.condition.assertNotEmpty(name, "name");
        Pre.condition.assertNotEmpty(currentVersion, "currentVersion");
        Pre.condition.assertNotEmpty(latestVersion, "latestVersion");
        
        this.name = name;
        this.currentVersion = currentVersion;
        this.latestVersion = latestVersion;
    }

    public static create(name: string, currentVersion: string, latestVersion: string): DependencyUpdate
    {
        return new DependencyUpdate(name, currentVersion, latestVersion);
    }

    public getName(): string
    {
        return this.name;
    }

    public getCurrentVersion(): string
    {
        return this.currentVersion;
    }

    public getLatestVersion(): string
    {
        return this.latestVersion;
    }

    public equals(rhs: DependencyUpdate): boolean
    {
        return rhs instanceof DependencyUpdate &&
            this.name === rhs.name &&
            this.currentVersion === rhs.currentVersion &&
            this.latestVersion === rhs.latestVersion;
    }

    public toString(): string
    {
        return JsonDataObject.create()
            .set("name", this.name)
            .set("currentVersion", this.currentVersion)
            .set("latestVersion", this.latestVersion)
            .toString();
    }
}