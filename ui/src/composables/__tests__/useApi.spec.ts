import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useFormErrors } from '../useApi';
import { nextTick } from 'vue';

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn()
  })
}));

describe('useFormErrors', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('initializes with empty errors and message', () => {
    const { formErrors, serverMessage } = useFormErrors();
    
    expect(formErrors.value).toEqual({});
    expect(serverMessage.value).toBe('');
  });

  it('clears errors and message', async () => {
    const { formErrors, serverMessage, clearErrors } = useFormErrors();
    
    // Set some values
    formErrors.value = { field1: 'Error 1' };
    serverMessage.value = 'Server error';
    
    // Clear them
    clearErrors();
    await nextTick();
    
    expect(formErrors.value).toEqual({});
    expect(serverMessage.value).toBe('');
  });

  it('handles API errors with the new format', async () => {
    const { formErrors, serverMessage, handleApiError } = useFormErrors();
    const mockError = {
      response: {
        status: 400,
        data: {
          errors: {
            field1: 'Error message 1',
            field2: 'Error message 2'
          },
          message: 'Validation failed'
        }
      }
    };
    
    handleApiError(mockError, 'test');
    await nextTick();
    
    expect(formErrors.value).toEqual({
      field1: 'Error message 1',
      field2: 'Error message 2'
    });
    expect(serverMessage.value).toBe('Validation failed');
  });

  it('handles API errors with the old format', async () => {
    const { formErrors, serverMessage, handleApiError } = useFormErrors();
    const mockError = {
      response: {
        status: 400,
        data: {
          field1: 'Error message 1',
          field2: ['Error message 2a', 'Error message 2b']
        }
      }
    };
    
    handleApiError(mockError, 'test');
    await nextTick();
    
    expect(formErrors.value).toEqual({
      field1: 'Error message 1',
      field2: 'Error message 2a, Error message 2b'
    });
    expect(serverMessage.value).toBe('操作(test)に失敗しました');
  });

  it('handles non-response errors', async () => {
    const { formErrors, serverMessage, handleApiError } = useFormErrors();
    const mockError = {
      message: 'Network error'
    };
    
    handleApiError(mockError, 'test');
    await nextTick();
    
    expect(formErrors.value).toEqual({
      '全般': 'エラーが発生しました: Network error'
    });
    expect(serverMessage.value).toBe('操作(test)に失敗しました');
  });
});