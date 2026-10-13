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
  const requiredValue = (key: string): string => {
    const value = optionalValue(key);

    if (!value) {
      throw new Error(`Missing required test account environment variable: ${key}`);
    }

    return value;
  };

  return {
    email: requiredValue(environmentKeys.email),
    password: requiredValue(environmentKeys.password),
    firstName: optionalValue(environmentKeys.firstName),
    lastName: optionalValue(environmentKeys.lastName),
  };
}

export const invalidUser: UserData = {
  email: 'user_invalid@example.com',
  password: 'InvalidPassword123!',
  firstName: '',
  lastName: '',
};
