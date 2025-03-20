import { mount } from '@vue/test-utils';
import ErrorAlert from '../ErrorAlert.vue';
import { describe, it, expect } from 'vitest';

describe('ErrorAlert.vue', () => {
  it('renders alert when there are errors', () => {
    const errors = {
      field1: 'Error message 1',
      field2: 'Error message 2'
    };
    
    const wrapper = mount(ErrorAlert, {
      props: {
        errors,
        message: 'Test error message'
      }
    });
    
    expect(wrapper.find('.alert-danger').exists()).toBe(true);
    expect(wrapper.find('h5').text()).toBe('Test error message');
    expect(wrapper.findAll('li').length).toBe(2);
    expect(wrapper.text()).toContain('field1: Error message 1');
    expect(wrapper.text()).toContain('field2: Error message 2');
  });
  
  it('does not render when there are no errors', () => {
    const wrapper = mount(ErrorAlert, {
      props: {
        errors: {},
        message: 'Test error message'
      }
    });
    
    expect(wrapper.find('.alert-danger').exists()).toBe(false);
  });
  
  it('renders errors as flat list when flatList is true', () => {
    const errors = {
      field1: 'Error message 1',
      field2: 'Error message 2'
    };
    
    const wrapper = mount(ErrorAlert, {
      props: {
        errors,
        message: 'Test error message',
        flatList: true
      }
    });
    
    expect(wrapper.find('.alert-danger').exists()).toBe(true);
    expect(wrapper.findAll('li').length).toBe(2);
    expect(wrapper.text()).toContain('Error message 1');
    expect(wrapper.text()).toContain('Error message 2');
    // Field names should not be in the output
    expect(wrapper.text()).not.toContain('field1:');
    expect(wrapper.text()).not.toContain('field2:');
  });
});