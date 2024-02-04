import {
  inputObjectType,
  intArg,
  mutationField,
  nonNull,
  stringArg,
} from 'nexus';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { JWT_EXPIRES_IN, JWT_SECRET } from '../../config';
import { checkPermissions } from '../../helpers/auth/checkPermissions';
import { AuthenticationError } from '../../helpers';

export const UserCreateInputType = inputObjectType({
  name: 'UserCreateInputType',
  definition(t) {
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.string('username');
    t.nonNull.gender('gender');
    t.nonNull.string('password');
    t.string('profile');
  },
});

export const UserUpdateInputType = inputObjectType({
  name: 'UserUpdateInputType',
  definition(t) {
    t.string('email');
    t.string('name');
    t.string('username');
    t.string('profile');
    t.gender('gender');
  },
});

export const signup = mutationField('signup', {
  type: 'AuthPayload',
  description: 'Create a new user and return the token and user',
  args: {
    data: nonNull('UserCreateInputType'),
  },
  resolve: async (_, { data }, ctx) => {
    const password = await hash(data.password, 10);
    const username = data.username || data.name.replace(/\s/g, '').toLowerCase() + Math.floor(Math.random() * 1000);

    const user = await ctx.prisma.user.create({
      data: { ...data, password, username },
    });

    return {
      token: sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET || 'secret',
        {
          expiresIn: JWT_EXPIRES_IN || '1d',
        },
      ),
      user,
    };
  },
});

export const login = mutationField('login', {
  type: 'AuthPayload',
  description: 'Login the user and return the token and user',
  args: {
    username: nonNull(stringArg()),
    password: nonNull(stringArg()),
  },
  resolve: async (_, { username, password }, ctx) => {
    const user = await ctx.prisma.user.findUnique({ where: { username } });
    if (!user) {
      throw new Error(`No user found for username: ${username}`);
    }

    const passwordValid = await compare(password, user.password);
    if (!passwordValid) {
      throw new Error('Invalid password');
    }

    return {
      token: sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET || 'secret',
        {
          expiresIn: JWT_EXPIRES_IN || '1d',
        },
      ),
      user,
    };
  },
});

export const updateProfile = mutationField('updateProfile', {
  type: 'User',
  description: 'Update the profile of the current logged in user or the user with the given id if the user is an admin',
  args: {
    id: intArg(),
    data: nonNull('UserUpdateInputType'),
  },
  authorize: (_parent, _args, ctx) => {
    return _args.id
      ? checkPermissions(ctx, ['ADMIN'])
      : checkPermissions(ctx, []);
  },
  resolve: async (_, { data, id }, ctx) => {
    const userId = id || ctx.auth?.id;

    if (!userId) {
      throw AuthenticationError;
    }

    const user = await ctx.prisma.user.update({
      where: { id: userId },
      data: {
        email: data.email || undefined,
        name: data.name || undefined,
        profile: data.profile || undefined,
        gender: data.gender || undefined,
        username: data.username || undefined,
      },
    });

    return user;
  },
});

export const changePassword = mutationField('changePassword', {
  type: 'Boolean',
  description: 'Change the password of the current logged in user',
  args: {
    username: stringArg(),
    oldPassword: stringArg(),
    newPassword: nonNull(stringArg()),
  },
  resolve: async (_, { username, oldPassword, newPassword }, ctx) => {
    if (username && oldPassword) {
      const user = await ctx.prisma.user.findUnique({ where: { username } });
      if (!user) {
        throw new Error(`No user found for username: ${username}`);
      }

      const passwordValid = await compare(oldPassword, user.password);
      if (!passwordValid) {
        throw new Error('Invalid password');
      }

      const password = await hash(newPassword, 10);
      await ctx.prisma.user.update({
        where: { id: user.id },
        data: { password },
      });

      return true;
    } else {
      if (!ctx.auth?.id) {
        throw AuthenticationError;
      }

      const password = await hash(newPassword, 10);
      await ctx.prisma.user.update({
        where: { id: ctx.auth?.id },
        data: { password },
      });

      return true;
    }
  },
});
