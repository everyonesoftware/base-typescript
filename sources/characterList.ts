import { Indexable } from "./indexable";
import { IndexableIterator } from "./indexableIterator";
import { Iterable } from "./iterable";
import { JavascriptIterable, JavascriptIterator } from "./javascript";
import { List } from "./list";
import { MapIterable } from "./mapIterable";
import { Post } from "./post";
import { Pre } from "./pre";
import { Result } from "./result";
import { StringIterator } from "./stringIterator";
import { isString, Type } from "./types";

/**
 * An expandable {@link List} of characters.
 */
export class CharacterList implements List<string>
{
    private characters: string;

    private constructor()
    {
        this.characters = "";
    }

    public static create(values?: JavascriptIterable<string>): CharacterList
    {
        let result: CharacterList = new CharacterList();
        if (values)
        {
            result.addAll(values);
        }
        return result;
    }

    public set(index: number, value: string): this
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");
        Pre.condition.assertEqual(value.length, 1, "value.length");

        let newCharacters: string = "";
        if (0 < index)
        {
            newCharacters += this.characters.substring(0, index);
        }
        newCharacters += value;
        if (index < this.getCount() - 1)
        {
            newCharacters += this.characters.substring(index + 1);
        }
        this.characters = newCharacters;

        return this;
    }

    public iterate(): IndexableIterator<string>
    {
        return StringIterator.create(this.characters);
    }

    public getCount(): number
    {
        return this.characters.length;
    }

    public get(index: number): string
    {
        Pre.condition.assertAccessIndex(index, this.getCount(), "index");

        const result: string = this.characters[index];

        Post.condition.assertEqual(result.length, 1, "result.length");

        return result;
    }

    private internalInsert(index: number, value: string): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertNotUndefinedAndNotNull(value, "value");

        let newCharacters: string = "";
        if (0 < index)
        {
            newCharacters += this.characters.substring(0, index);
        }
        newCharacters += value;
        if (index < this.getCount())
        {
            newCharacters += this.characters.substring(index);
        }
        this.characters = newCharacters;

        return this;
    }

    public insert(index: number, value: string): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertEqual(value.length, 1, "value.length");

        return this.internalInsert(index, value);
    }

    public equals(right: Iterable<string>): boolean
    {
        return Iterable.equals(this, right);
    }

    public toString(): string
    {
        return this.characters;
    }

    public toArray(): string[]
    {
        return this.characters.split("");
    }

    public map<TOutput>(mapping: (value: string) => TOutput): MapIterable<string, TOutput>
    {
        return Iterable.map(this, mapping);
    }

    public where(condition: (value: string) => boolean): Iterable<string>
    {
        return Iterable.where(this, condition);
    }

    public instanceOf<T extends string>(typeOrTypeCheck: Type<T> | ((value: string) => value is T)): Iterable<T>
    {
        return Iterable.instanceOf(this, typeOrTypeCheck);
    }

    public any(): boolean
    {
        return this.characters.length > 0;
    }

    public first(): Result<string>
    {
        return Indexable.first(this);
    }

    public last(): Result<string>
    {
        return Indexable.last(this);
    }

    public add(value: string): this
    {
        return List.add(this, value);
    }

    public addAll(values: JavascriptIterable<string> | string): this
    {
        return List.addAll(this, values);
    }

    public insertAll(index: number, values: JavascriptIterable<string> | string): this
    {
        Pre.condition.assertInsertIndex(index, this.getCount(), "index");
        Pre.condition.assertNotUndefinedAndNotNull(values, "values");

        if (isString(values))
        {
            this.internalInsert(index, values);
        }
        else
        {
            List.insertAll(this, index, values);
        }
        return this;
    }

    public [Symbol.iterator](): JavascriptIterator<string>
    {
        return Iterable[Symbol.iterator](this);
    }
}