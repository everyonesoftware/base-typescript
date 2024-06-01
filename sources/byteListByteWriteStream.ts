import { ByteList } from "./byteList";
import { ByteWriteStream } from "./byteWriteStream";
import { Pre } from "./pre";
import { Result } from "./result";
import { WriteStream } from "./writeStream";

export class ByteListByteWriteStream implements ByteWriteStream
{
    private readonly byteList: ByteList;

    protected constructor()
    {
        this.byteList = ByteList.create();
    }

    public static create(): ByteListByteWriteStream
    {
        return new ByteListByteWriteStream();
    }

    public writeByte(byte: number): Result<number>
    {
        return ByteWriteStream.writeByte(this, byte);
    }

    public writeBytes(bytes: number[] | Uint8Array, startIndex?: number, length?: number): Result<number>
    {
        Pre.condition.assertNotUndefinedAndNotNull(bytes, "bytes");
        startIndex = WriteStream.getStartIndex(startIndex);
        length = WriteStream.getLength(bytes.length, startIndex, length);

        return Result.create(() =>
        {
            this.byteList.addAll(bytes.slice(startIndex, startIndex + length));

            return length;
        });
    }

    public getBytes(): Uint8Array
    {
        return this.byteList.toUint8Array();
    }
}