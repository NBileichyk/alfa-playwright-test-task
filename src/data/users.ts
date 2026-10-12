import { UserRole } from '../enums/user-role.enum';
import type { UserData } from '../types/user-data.interface';

const userEnvironmentKeys: Record<UserRole, Record<keyof UserData, string>> = {
  [UserRole.STANDARD_USER_1]: {
    email: 'TEST_USER_1_EMAIL',
    password: 'TEST_USER_1_PASSWORD',
    firstName: 'TEST_USER_1_FIRST_NAME',
    lastName: 'TEST_USER_1_LAST_NAME',
  },
  [UserRole.STANDARD_USER_2]: {
    email: 'TEST_USER_2_EMAIL',
    password: 'TEST_USER_2_PASSWORD',
    firstName: 'TEST_USER_2_FIRST_NAME',
    lastName: 'TEST_USER_2_LAST_NAME',
  },
};

export function getUser(role: UserRole): UserData {
  const environmentKeys = userEnvironmentKeys[role];
  const optionalValue = (key: string): string | undefined => process.env[key]?.trim() || undefined;
  const requiredValue = (key: string, legacyKey?: string): string => {
    const value = optionalValue(key) ?? (legacyKey ? optionalValue(legacyKey) : undefined);

    if (!value) {
      const alternatives = legacyKey ? ` or ${legacyKey}` : '';
      throw new Error(`Missing required test account environment variable: ${key}${alternatives}`);
    }

    return value;
  };

  const optionalName = (key: string): string | undefined => optionalValue(key);
  const isLegacyFirstUser = role === UserRole.STANDARD_USER_1;

  return {
    email: requiredValue(environmentKeys.email, isLegacyFirstUser ? 'TEST_USER_EMAIL' : undefined),
    password: requiredValue(
      environmentKeys.password,
      isLegacyFirstUser ? 'TEST_USER_PASSWORD' : undefined
    ),
    firstName: optionalName(environmentKeys.firstName),
    lastName: optionalName(environmentKeys.lastName),
  };
}

export const invalidUser: UserData = {
  email: 'user_invalid@example.com',
  password: 'InvalidPassword123!',
  firstName: '',
  lastName: '',
};
