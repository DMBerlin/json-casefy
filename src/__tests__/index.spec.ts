import { Casefy } from '../index';

describe('Casefy Main API', () => {
  it('should export Casefy with this method', () => {
    expect(Casefy).toBeDefined();
    expect(typeof Casefy.this).toBe('function');
  });

  it('should transform using the main API', () => {
    const input = { user_name: 'John', user_age: 30 };
    const result = Casefy.this(input, { from: 'snake_case', to: 'camelCase' });

    expect(result.data).toEqual({ userName: 'John', userAge: 30 });
    expect(result.transformedKeys).toBe(2);
    expect(result.from).toBe('snake_case');
    expect(result.to).toBe('camelCase');
  });

  it('should handle all case style combinations', () => {
    const input = { user_name: 'John' };

    // snake_case to camelCase
    expect(Casefy.this(input, { from: 'snake_case', to: 'camelCase' }).data).toEqual({
      userName: 'John',
    });

    // snake_case to PascalCase
    expect(Casefy.this(input, { from: 'snake_case', to: 'PascalCase' }).data).toEqual({
      UserName: 'John',
    });

    // snake_case to kebab-case
    expect(Casefy.this(input, { from: 'snake_case', to: 'kebab-case' }).data).toEqual({
      'user-name': 'John',
    });
  });

  it('should handle complex nested structures', () => {
    const input = {
      user_profile: {
        personal_info: {
          first_name: 'John',
          last_name: 'Doe',
        },
        contact_details: [{ email_address: 'john@example.com' }, { phone_number: '123-456-7890' }],
      },
    };

    const result = Casefy.this(input, { from: 'snake_case', to: 'camelCase' });

    expect(result.data).toEqual({
      userProfile: {
        personalInfo: {
          firstName: 'John',
          lastName: 'Doe',
        },
        contactDetails: [{ emailAddress: 'john@example.com' }, { phoneNumber: '123-456-7890' }],
      },
    });
    expect(result.transformedKeys).toBe(7);
  });
});
