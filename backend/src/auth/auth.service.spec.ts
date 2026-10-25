jest.mock('@nestjs/bullmq', () => ({
  InjectQueue: () => () => undefined,
}));

import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UnauthorizedException } from '@nestjs/common';
import { Response } from 'express';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const usersServiceMock = {
    getUser: jest.fn(),
  };

  const configServiceMock = {
    getOrThrow: jest.fn(),
  };

  const jwtServiceMock = {
    sign: jest.fn(),
  };

  const userMock = {
    id: 1,
    email: 'test@example.com',
    password: 'hash-password',
    isActive: true,
    createdAt: new Date(),
  } as User;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: ConfigService, useValue: configServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('verifyUser', () => {
    it('should return user when credentials are valid', async () => {
      usersServiceMock.getUser.mockResolvedValue(userMock);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.verifyUser(
        'test@example.com',
        'correct-password',
      );

      expect(result).toEqual(userMock);

      expect(usersServiceMock.getUser).toHaveBeenCalledWith({
        email: 'test@example.com',
      });

      expect(bcrypt.compare).toHaveBeenCalledWith(
        'correct-password',
        'hash-password',
      );
    });

    it('should throw UnauthorizedException when password is incorrect', async () => {
      usersServiceMock.getUser.mockResolvedValue(userMock);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.verifyUser('test@example.com', 'wrong-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user does not exist', async () => {
      usersServiceMock.getUser.mockResolvedValue(null);

      await expect(
        service.verifyUser('unknown@example.com', 'any-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException when user is inactive', async () => {
      usersServiceMock.getUser.mockResolvedValue({
        ...userMock,
        isActive: false,
      });

      await expect(
        service.verifyUser('test@example.com', 'correct-password'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should not compare password when user is inactive', async () => {
      usersServiceMock.getUser.mockResolvedValue({
        ...userMock,
        isActive: false,
      });

      await expect(
        service.verifyUser('test@example.com', 'correct-password'),
      ).rejects.toThrow(UnauthorizedException);

      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('should throw UnauthorizedException when user lookup fails', async () => {
      usersServiceMock.getUser.mockRejectedValue(new Error('Database error'));

      await expect(
        service.verifyUser('test@example.com', 'correct-password'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    let response: Pick<Response, 'cookie'>;
    let cookieMock: jest.Mock;

    beforeEach(() => {
      cookieMock = jest.fn();

      response = {
        cookie: cookieMock,
      };

      configServiceMock.getOrThrow.mockReturnValue('1h');
      jwtServiceMock.sign.mockReturnValue('mock-jwt-token');
    });

    it('should sign a JWT containing the userId', () => {
      service.login(userMock, response);

      expect(jwtServiceMock.sign).toHaveBeenCalledWith({
        userId: 1,
      });
    });

    it('should set an HTTP-only, secure Authentication cookie', () => {
      service.login(userMock, response);

      expect(response.cookie).toHaveBeenCalledWith(
        'Authentication',
        'mock-jwt-token',
        expect.objectContaining({
          secure: true,
          httpOnly: true,
          expires: expect.any(Date) as Date,
        }),
      );
    });

    it('should calculate cookie expiration from JWT_EXPIRATION', () => {
      const before = Date.now();

      service.login(userMock, response);

      const after = Date.now();

      expect(cookieMock).toHaveBeenCalledWith(
        expect.any(String), // назва куки (наприклад, 'Authentication')
        'mock-jwt-token', // значення токену
        expect.objectContaining({
          expires: expect.any(Date) as Date,
        }),
      );
      const [, , cookieOptions] = cookieMock.mock.calls[0] as [
        string,
        string,
        import('express').CookieOptions,
      ];
      const expires = cookieOptions.expires as Date;

      expect(expires.getTime()).toBeGreaterThanOrEqual(before + 60 * 60 * 1000);

      expect(expires.getTime()).toBeLessThanOrEqual(
        after + 60 * 60 * 1000 + 10,
      );
    });

    it('should return the token payload containing the userId', () => {
      const result = service.login(userMock, response);

      expect(result).toEqual({
        tokenPayload: {
          userId: 1,
        },
      });
    });
  });
});
