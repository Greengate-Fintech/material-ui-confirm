import React from 'react';
import { mount } from 'enzyme';
import { createMount } from '@material-ui/core/test-utils';

import { ConfirmProvider, useConfirm } from '../src/index';

describe('useConfirm', () => {
  const handleClick = jest.fn();

  const TestComponent = ({ confirmOptions }) => {
    const confirm = useConfirm();

    return (
      <button onClick={() => confirm(confirmOptions).then(handleClick).catch(() => {})}>
        Delete
      </button>
    );
  };

  const TestComponentWrapper = ({ confirmOptions }) => (
    <div>
      <ConfirmProvider>
        <TestComponent confirmOptions={confirmOptions} />
      </ConfirmProvider>
    </div>
  );

  beforeEach(() => handleClick.mockReset());

  test('calls confirmation callback on confirm', () => {
    const wrapper = mount(<TestComponentWrapper />);
    expect(wrapper.find('Dialog').props().open).toBe(false);
    wrapper.find('button[children="Delete"]').simulate('click');
    expect(wrapper.find('Dialog').props().open).toBe(true);
    wrapper.find('Button[children="Ok"]').simulate('click');
    expect(handleClick).toHaveBeenCalled();
    expect(wrapper.find('Dialog').props().open).toBe(false);
  });

  test('does not call confirmation callback on cancel', () => {
    const wrapper = mount(<TestComponentWrapper />);
    expect(wrapper.find('Dialog').props().open).toBe(false);
    wrapper.find('button[children="Delete"]').simulate('click');
    expect(wrapper.find('Dialog').props().open).toBe(true);
    wrapper.find('Button[children="Cancel"]').simulate('click');
    expect(handleClick).not.toHaveBeenCalled();
    expect(wrapper.find('Dialog').props().open).toBe(false);
  });

  describe('options', () => {
    test('accepts custom text', () => {
      const wrapper = mount(
        <TestComponentWrapper confirmOptions={{
          title: 'Remove this item?',
          description: 'This will permanently remove the item.',
          cancellationText: 'No way',
          confirmationText: 'Yessir',
        }} />
      );
      console.log(wrapper.html())
      wrapper.find('button[children="Delete"]').simulate('click');
      expect(wrapper.text()).toMatch('Remove this item?');
      expect(wrapper.text()).toMatch('This will permanently remove the item.');
      expect(wrapper.find('Button[children="No way"]')).toHaveLength(1);
      expect(wrapper.find('Button[children="Yessir"]')).toHaveLength(1);
    });

  //   test('calls onCancel when cancaled', () => {
  //     const onCancel = jest.fn();
  //     const wrapper = mount(
  //       <TestComponentWrapper confirmOptions={{ onCancel }} />
  //     );
  //     wrapper.find('button[children="Delete"]').simulate('click');
  //     wrapper.find('Button[children="Cancel"]').simulate('click');
  //     expect(onCancel).toHaveBeenCalled();
  //     onCancel.mockReset();
  //     wrapper.find('button[children="Delete"]').simulate('click');
  //     wrapper.find('Button[children="Ok"]').simulate('click');
  //     expect(onCancel).not.toHaveBeenCalled();
  //   });
  //
  //   test('calls onClose whenever dialog is closed', () => {
  //     const onClose = jest.fn();
  //     const wrapper = mount(
  //       <TestComponentWrapper confirmOptions={{ onClose }} />
  //     );
  //     wrapper.find('button[children="Delete"]').simulate('click');
  //     wrapper.find('Button[children="Cancel"]').simulate('click');
  //     expect(onClose).toHaveBeenCalled();
  //     onClose.mockReset();
  //     wrapper.find('button[children="Delete"]').simulate('click');
  //     wrapper.find('Button[children="Ok"]').simulate('click');
  //     expect(onClose).toHaveBeenCalled();
  //   });
  });

  // test('properly passes arguments to the confirmation callback', () => {
  //   const handleClick = jest.fn();
  //   const CustomButton = ({ onClick, ...props }) => {
  //     return (
  //       <button {...props} onClick={_event => onClick('arg1', 'arg2')} />
  //     );
  //   };
  //   const TestComponent = ({ confirmOptions, confirm }) => {
  //     return (
  //       <CustomButton onClick={confirm(handleClick, confirmOptions)}>
  //         Delete
  //       </CustomButton>
  //     );
  //   };
  //   const TestComponentWrapper = withConfirm(TestComponent);
  //   const wrapper = mount(<TestComponentWrapper />);
  //   expect(wrapper.find('Dialog').props().open).toBe(false);
  //   wrapper.find('button[children="Delete"]').simulate('click');
  //   expect(wrapper.find('Dialog').props().open).toBe(true);
  //   wrapper.find('Button[children="Ok"]').simulate('click');
  //   expect(handleClick).toHaveBeenCalledWith('arg1', 'arg2');
  //   expect(wrapper.find('Dialog').props().open).toBe(false);
  // });
});