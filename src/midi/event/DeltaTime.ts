import { FileHandle } from 'fs/promises';
import { toVariableLengthQuantity } from '@src/midi/io/io-fns';

//Time elapsed between an event and the one just before it.
export class DeltaTime {
  static ofTicks(ticks: number): DeltaTime {
    return new DeltaTime(ticks);
  }

  private constructor(readonly ticks: number) {}

  plus(other: DeltaTime): DeltaTime {
    return new DeltaTime(this.ticks + other.ticks);
  }

  async write(file: FileHandle): Promise<number> {
    const buffer = toVariableLengthQuantity(this.ticks);
    const writeQuantity = await file.write(buffer);
    return writeQuantity.bytesWritten;
  }
}
