import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { PrismaService } from '../../database/prisma/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll() {
    return this.prismaService.apiKey.findMany({
      select: {
        id: true,
        name: true,
        secretKey: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async create(dto: CreateApiKeyDto) {
    for (let attempt = 0; attempt < 3; attempt += 1) {
      const secretKey = randomBytes(24).toString('hex');

      try {
        return await this.prismaService.apiKey.create({
          data: {
            name: dto.name,
            secretKey,
          },
          select: {
            id: true,
            name: true,
            secretKey: true,
            isActive: true,
            createdAt: true,
          },
        });
      } catch (error) {
        if (this.isUniqueConstraintError(error)) {
          continue;
        }

        throw error;
      }
    }

    throw new ConflictException(
      'Unable to generate a unique API key. Please try again.',
    );
  }

  async remove(id: string) {
    const existing = await this.prismaService.apiKey.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) {
      throw new NotFoundException('API key not found.');
    }
    await this.prismaService.apiKey.delete({ where: { id } });
    return { message: 'API key deleted successfully.' };
  }

  async validateSecretKey(secretKey: string) {
    return this.prismaService.apiKey.findFirst({
      where: {
        secretKey,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        secretKey: true,
      },
    });
  }

  private isUniqueConstraintError(error: unknown) {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'P2002'
    );
  }
}
