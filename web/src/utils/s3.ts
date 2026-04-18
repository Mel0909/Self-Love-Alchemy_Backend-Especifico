import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadImageToS3(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = file.name.split(".").pop();
  const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file.type,
    })
  );

  return `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
}

export async function deleteImageFromS3(imageUrl: string) {
  try {
    const urlParts = imageUrl.split("/");
    const key = urlParts[urlParts.length - 1];

    if (!key) throw new Error("Não foi possível extrair a chave da URL");

    console.log(`[S3] Removendo arquivo: ${key}`);

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: key,
      })
    );
  } catch (error) {
    console.error("[S3] Erro ao deletar objeto:", error);
  }
}