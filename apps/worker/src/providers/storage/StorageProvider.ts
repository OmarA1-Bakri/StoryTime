export type PutObjectInput = { bucket: string; key: string; body: Uint8Array; mimeType: string };
export type StoredObject = { bucket: string; key: string; sizeBytes: number; mimeType: string };
export type SignedReadUrlInput = { bucket: string; key: string; expiresInSeconds: number };

export interface StorageProvider {
  putObject(input: PutObjectInput): Promise<StoredObject>;
  getSignedReadUrl(input: SignedReadUrlInput): Promise<string>;
  deleteObject(input: { bucket: string; key: string }): Promise<void>;
  headObject(input: { bucket: string; key: string }): Promise<StoredObject | null>;
}
