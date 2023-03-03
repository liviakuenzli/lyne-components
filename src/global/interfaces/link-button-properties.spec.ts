import {
  ButtonProperties,
  forwardHostEvent,
  LinkButtonProperties,
  LinkProperties,
  resolveLinkRenderVariables,
  resolveRenderVariables,
} from './link-button-properties';

describe('getLinkAttributeList', () => {
  it('should return attributes for link', () => {
    const linkProperties: LinkProperties = {
      href: 'link',
    };
    const expectedObj: Record<string, string> = {
      dir: 'ltr',
      href: 'link',
    };
    expect(resolveRenderVariables(linkProperties as LinkButtonProperties).attributes).toEqual(
      expectedObj
    );
  });

  it('should return attributes for link with target _blank', () => {
    const linkProperties: LinkProperties = {
      href: 'link',
      target: '_blank',
    };
    const expectedObj: Record<string, string> = {
      dir: 'ltr',
      href: 'link',
      target: '_blank',
      rel: 'external noopener nofollow',
    };
    expect(resolveRenderVariables(linkProperties as LinkButtonProperties).attributes).toEqual(
      expectedObj
    );
  });

  it('should return attributes for link with label, target _blank and custom rel', () => {
    const linkProperties: LinkProperties = {
      href: 'link',
      target: '_blank',
      rel: 'custom',
    };
    const expectedObj: Record<string, string> = {
      dir: 'ltr',
      href: 'link',
      target: '_blank',
      rel: 'custom',
    };
    expect(resolveRenderVariables(linkProperties as LinkButtonProperties).attributes).toEqual(
      expectedObj
    );
  });

  it('should return attributes for link with a custom target', () => {
    const linkProperties: LinkProperties = {
      href: 'link',
      target: 'custom',
    };
    const expectedObj: Record<string, string> = {
      dir: 'ltr',
      href: 'link',
      target: 'custom',
    };

    expect(resolveRenderVariables(linkProperties as LinkButtonProperties).attributes).toEqual(
      expectedObj
    );
  });

  it('should return attributes for disabled link', () => {
    const linkProperties: LinkButtonProperties = {
      href: 'link',
      disabled: true,
      type: null,
      name: null,
    };
    const expectedObj: Record<string, string> = {
      dir: 'ltr',
      href: 'link',
      tabIndex: '-1',
    };

    expect(resolveRenderVariables(linkProperties)).toEqual(expectedObj);
  });
});

describe('getButtonAttributeList', () => {
  it('should return attributes for button', () => {
    const buttonProperties: ButtonProperties = {
      type: 'submit',
      disabled: false,
      name: 'name',
      value: 'value',
      form: 'formid',
    };
    const expectedObj: Record<string, string> = {
      dir: 'ltr',
      'aria-label': 'Test',
      form: 'formid',
      name: 'name',
      type: 'submit',
      value: 'value',
      'aria-haspopup': 'true',
    };

    expect(resolveRenderVariables(buttonProperties as LinkButtonProperties).attributes).toEqual(
      expectedObj
    );
  });
});

describe('getLinkRenderVariables', () => {
  const linkButtonProperties: LinkButtonProperties = {
    href: 'link',
    target: '_blank',
    name: undefined,
    type: undefined,
    disabled: true,
  };

  it('should return the correct variables with screenReaderNewWindowInfo true', () => {
    const expectedObj = {
      tagName: 'a',
      attributes: {
        dir: 'ltr',
        role: 'presentation',
        tabIndex: '-1',
        href: 'link',
        target: '_blank',
        rel: 'external noopener nofollow',
      },
      hostAttributes: {
        role: 'link',
      },
      screenReaderNewWindowInfo: true,
    };
    expect(resolveRenderVariables(linkButtonProperties)).toEqual(expectedObj);
  });

  it('should return the correct variables with screenReaderNewWindowInfo false', () => {
    const linkButtonPropertiesNoScreenReader: LinkButtonProperties = {
      ...linkButtonProperties,
      target: 'custom',
    };
    const expectedObj = {
      tagName: 'a',
      attributes: {
        dir: 'ltr',
        role: 'presentation',
        tabIndex: '-1',
        href: 'link',
        target: 'custom',
        'aria-label': 'accessibilityLabel',
      },
      hostAttributes: {
        role: 'link',
      },
      screenReaderNewWindowInfo: false,
    };
    expect(resolveRenderVariables(linkButtonPropertiesNoScreenReader)).toEqual(expectedObj);
  });
});

describe('getButtonRenderVariables', () => {
  const buttonProperties: ButtonProperties = {
    type: 'submit',
    name: 'name',
  };

  it('should return the correct variables', () => {
    const expectedObj = {
      tagName: 'button',
      attributes: {
        dir: 'ltr',
        role: 'presentation',
        tabIndex: '-1',
        name: 'name',
        type: 'submit',
      },
      hostAttributes: {
        role: 'button',
      },
    };

    expect(resolveRenderVariables(buttonProperties as LinkButtonProperties)).toEqual(expectedObj);
  });
});

describe('getLinkButtonStaticRenderVariables', () => {
  it('should return the correct variables', () => {
    const expectedObj = {
      tagName: 'span',
      attributes: {
        dir: 'ltr',
        role: 'presentation',
        tabIndex: '-1',
      },
    };

    expect(resolveRenderVariables({ isStatic: true, href: null, name: null, type: null })).toEqual(
      expectedObj
    );
  });
});

// FIXME how to spy on imported function without workaround? https://github.com/jasmine/jasmine/issues/1414
describe('resolveRenderVariables', () => {
  const linkButtonProperties: LinkButtonProperties = {
    href: 'link',
    target: undefined,
    type: undefined,
    name: undefined,
  };

  it('should return variables for the static case', () => {
    const retObj = resolveRenderVariables({ ...linkButtonProperties, isStatic: true });
    expect(retObj.tagName).toEqual('span');
  });

  it('should return variables for the link case', () => {
    const retObj = resolveRenderVariables(linkButtonProperties);
    expect(retObj.tagName).toEqual('a');
  });

  it('should return variables for the button case', () => {
    const retObj = resolveRenderVariables({ ...linkButtonProperties, href: undefined });
    expect(retObj.tagName).toEqual('button');
  });
});

describe('resolveLinkRenderVariables', () => {
  const linkProperties: LinkProperties = {
    href: 'link',
    target: undefined,
  };

  it('should return variables for the static case', () => {
    const retObj = resolveLinkRenderVariables({ ...linkProperties, href: undefined });
    expect(retObj.tagName).toEqual('span');
  });

  it('should return variables for the link case', () => {
    const retObj = resolveLinkRenderVariables(linkProperties);
    expect(retObj.tagName).toEqual('a');
  });
});

describe('forwardHostClick', () => {
  let event: Event, host: HTMLElement, actionElement: HTMLElement;

  beforeEach(() => {
    event = new Event('click', { cancelable: true });
    host = new HTMLElement();
    actionElement = new HTMLElement();
  });

  it('should forward host click', () => {
    // Simulate shadow DOM context
    jest.spyOn(event, 'composedPath').mockReturnValue([host]);
    const eventSpy = jest.spyOn(actionElement, 'dispatchEvent');

    forwardHostEvent(event, host, actionElement);

    const copiedEvent = eventSpy.mock.lastCall[0];
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(copiedEvent.type).toEqual('click');
    expect(copiedEvent.bubbles).toEqual(false);
  });

  it('should not forward because click is not on host', () => {
    const eventSpy = jest.spyOn(actionElement, 'dispatchEvent');

    forwardHostEvent(event, host, actionElement);

    expect(eventSpy).toHaveBeenCalledTimes(0);
  });

  it('should create a new event if original event is not cancelable', () => {
    event = new Event('click', { cancelable: false });

    // Simulate shadow DOM context
    jest.spyOn(event, 'composedPath').mockReturnValue([host]);

    const eventSpy = jest.spyOn(actionElement, 'dispatchEvent');

    forwardHostEvent(event, host, actionElement);

    const copiedEvent = eventSpy.mock.lastCall[0];
    expect(eventSpy).toHaveBeenCalledTimes(1);
    expect(copiedEvent.type).toEqual('click');
  });
});
