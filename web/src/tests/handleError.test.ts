import { describe, it, expect, vi } from 'vitest';

vi.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: class {
      send = vi.fn().mockResolvedValue({});
    },
    PutObjectCommand: class {
      constructor(public params: any) {}
    },
  };
});

import { uploadImageToS3 } from '@/utils/s3';

describe('S3 Utility - Unit Test', () => {
  it('deve gerar a URL correta e chamar o cliente do S3', async () => {
    
    process.env.AWS_REGION = 'us-east-2';
    process.env.S3_BUCKET_NAME = 'alchemy-bucket-test';

    const file = new File(['conteudo-magico'], 'poção.png', { type: 'image/png' });
    
    const url = await uploadImageToS3(file);

    expect(url).toBeDefined();
    expect(url).toContain('alchemy-bucket-test');
    expect(url).toContain('poção.png');
    expect(url).toContain('amazonaws.com');
  });
});