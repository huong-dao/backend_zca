import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma/prisma.service';
import { AuthenticatedUser } from '../../common/utils/authenticated-user';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const SALT_ROUNDS = 10;

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async findAll(query: FindUsersDto) {
    const { page = 1, limit = 20 } = query;
    const skip = (page - 1) * limit;

    const [total, data] = await this.prismaService.$transaction([
      this.prismaService.user.count(),
      this.prismaService.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
    ]);

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: total === 0 ? 0 : Math.ceil(total / limit),
      },
    };
  }

  async create(dto: CreateUserDto) {
    const existingUser = await this.prismaService.user.findUnique({
      where: { email: dto.email },
      select: { id: true },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

    return this.prismaService.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        role: dto.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.ensureUserExists(id);

    if (dto.email) {
      const duplicatedEmailUser = await this.prismaService.user.findFirst({
        where: {
          email: dto.email,
          id: { not: id },
        },
        select: { id: true },
      });

      if (duplicatedEmailUser) {
        throw new ConflictException('Email already exists.');
      }
    }

    return this.prismaService.user.update({
      where: { id },
      data: dto,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async remove(id: string) {
    await this.ensureUserExists(id);

    await this.prismaService.user.delete({
      where: { id },
    });

    return {
      message: 'User deleted successfully.',
    };
  }

  async changePassword(user: AuthenticatedUser, dto: ChangePasswordDto) {
    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException(
        'New password must be different from old password.',
      );
    }

    const existingUser = await this.prismaService.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        password: true,
        isActive: true,
      },
    });

    if (!existingUser || !existingUser.isActive) {
      throw new NotFoundException('User not found.');
    }

    const isOldPasswordMatched = await bcrypt.compare(
      dto.oldPassword,
      existingUser.password,
    );

    if (!isOldPasswordMatched) {
      throw new BadRequestException('Old password is incorrect.');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, SALT_ROUNDS);

    await this.prismaService.user.update({
      where: { id: existingUser.id },
      data: {
        password: hashedPassword,
      },
    });

    return {
      message: 'Password changed successfully.',
    };
  }

  private async ensureUserExists(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }
  }
}
