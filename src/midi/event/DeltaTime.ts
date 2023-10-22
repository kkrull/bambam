import { FileHandle } from 'fs/promises';

//Time elapsed between an event and the one just before it.
export class DeltaTime {
  static ofTicks(ticks: number): DeltaTime {
    return new DeltaTime(ticks);
  }

  private constructor(readonly ticks: number) {}

  plus(other: DeltaTime): DeltaTime {
    return new DeltaTime(this.ticks + other.ticks);
  }

  toVariableLengthQuantity(): number[] {
    let quantity = this.ticks;
    const bytes = [];

    bytes.unshift(quantity & 0x7f);
    quantity = quantity >> 7;
    while (quantity > 0) {
      const quantityBits = quantity & 0x7f;
      const byte = quantityBits | 0x80;
      bytes.unshift(byte);
      quantity = quantity >> 7;
    }

    return bytes;
  }

  async write(file: FileHandle): Promise<number> {
    const buffer = Buffer.from(this.toVariableLengthQuantity());
    const writeQuantity = await file.write(buffer);
    return writeQuantity.bytesWritten;
  }
}
