import type { PutObjectInput, SignedReadUrlInput, StorageProvider, StoredObject } from "./StorageProvider";

export class LocalStorageProvider implements StorageProvider {
  private readonly objects = new Map<string, StoredObject>();

  async putObject(input: PutObjectInput): Promise<StoredObject> {
    const object = { bucket: input.bucket, key: input.key, sizeBytes: input.body.byteLength, mimeType: input.mimeType };
    this.objects.set(`${input.bucket}/${input.key}`, object);
    return object;
  }

  async getSignedReadUrl(input: SignedReadUrlInput): Promise<string> {
    return `local://signed/${input.bucket}/${input.key}?ttl=${input.expiresInSeconds}`;
  }

  async deleteObject(input: { bucket: string; key: string }): Promise<void> {
    this.objects.delete(`${input.bucket}/${input.key}`);
  }

  async headObject(input: { bucket: string; key: string }): Promise<StoredObject | null> {
    return this.objects.get(`${input.bucket}/${input.key}`) ?? null;
  }
}
