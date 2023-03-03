import getDocumentWritingMode from '../helpers/get-document-writing-mode';

/**
 * Enumeration for type attribute in <button> HTML tag.
 */
export type ButtonType = 'button' | 'reset' | 'submit';

/**
 * Enumeration for the 'aria-haspopup' values on the <button> HTML tag.
 */
export type PopupType = 'true' | 'dialog' | 'menu' | 'listbox' | 'tree' | 'grid';

/**
 * Enumeration for 'target' attribute in <a> HTML tag.
 */
export type LinkTargetType = '_blank' | '_self' | '_parent' | '_top';

/**
 * The interface contains attributes that can be set on an <a> tag.
 */
export interface LinkProperties {
  /** The href value you want to link to. */
  href: string | undefined;

  /** Where to display the linked URL. */
  target?: LinkTargetType | string | undefined;

  /** The relationship of the linked URL as space-separated link types. */
  rel?: string | undefined;

  /** Whether the browser will show the download dialog on click. */
  download?: boolean | undefined;

  /** aria-label attribute value. */
  ariaLabel?: string | undefined;
}

/**
 * The interface contains attributes that can be set on an <button> tag.
 */
export interface ButtonProperties {
  /** The type attribute to use for the button. */
  type: ButtonType | undefined;

  /** Whether the button is disabled. */
  disabled?: boolean | undefined;

  /** The name attribute to use for the button. */
  name: string | undefined;

  /** The value attribute to use for the button. */
  value?: string | undefined;

  /** The <form> element to associate the button with. */
  form?: string | undefined;
}

/**
 * A component that implements LinkButtonProperties should use this interface to set useful variables for render function.
 */
export interface LinkButtonRenderVariables {
  /**
   * The tag's name rendered by the component.
   */
  tagName: 'a' | 'button' | 'span';

  /**
   * The tag's attributes; can be set using getLinkButtonBaseAttributeList(...),
   * getLinkAttributeList(...) or getButtonAttributeList(...) methods.
   */
  attributes: Record<string, string>;

  /**
   * The host's attributes.
   */
  hostAttributes?: Record<string, string>;

  /**
   * Indicates whether the screen reader has to announce that the link will open in a new window.
   */
  screenReaderNewWindowInfo?: boolean;
}

/**
 * The interface contains the possible attributes of both the <a> and the <button> tags.
 * It is intended to be used in all cases where a component needs to render a tag that can be an <a> or a <button>,
 * for instance depending on whether the value of the href attribute is present or not.
 * NOTE: a class could not be created because StencilJS does not support inheritance/component extension.
 */
export interface LinkButtonProperties extends LinkProperties, ButtonProperties {}

export interface IsStaticProperty {
  isStatic: boolean;
}

/** Creates the basic attribute list for the link/button tag; undefined/null properties are not set. */
function getLinkButtonBaseAttributeList(): Record<string, string> {
  return {
    dir: getDocumentWritingMode(),
    role: 'presentation',
    tabIndex: '-1',
  };
}

/**
 * Lists all attributes for a link; undefined/null properties are not set.
 * @param linkProperties link properties
 */
function getLinkAttributeList(linkProperties: LinkProperties): Record<string, string> {
  const baseAttributeList = getLinkButtonBaseAttributeList();

  return !linkProperties.href
    ? baseAttributeList
    : Object.assign(
        {
          href: linkProperties.href,
          download: linkProperties.download ? '' : undefined,
          target: linkProperties.target,
          rel: linkProperties.rel
            ? linkProperties.rel
            : linkProperties.target === '_blank'
            ? 'external noopener nofollow'
            : undefined,
        },
        baseAttributeList
      );
}

/**
 * Lists all attributes for a button; undefined/null properties are not set.
 * @param buttonProperties button properties
 */
function getButtonAttributeList(buttonProperties: ButtonProperties): Record<string, string> {
  const baseAttributeList = getLinkButtonBaseAttributeList();

  return Object.assign(
    {
      name: buttonProperties.name || undefined,
      type: buttonProperties.type || 'button',
      disabled: buttonProperties.disabled ? 'true' : undefined,
      value: buttonProperties.value ?? undefined,
    },
    baseAttributeList
  );
}

/**
 * Set default render variables for link case.
 * @param linkProperties used to set the 'attributes' property.
 */
function getLinkRenderVariables(
  linkProperties: LinkProperties & Pick<ButtonProperties, 'disabled'>
): LinkButtonRenderVariables {
  return {
    tagName: 'a',
    attributes: getLinkAttributeList(linkProperties),
    hostAttributes: Object.assign(
      { role: 'link' },
      !linkProperties.disabled ? { tabIndex: '0' } : undefined
    ),
    screenReaderNewWindowInfo: !linkProperties.ariaLabel && linkProperties.target === '_blank',
  };
}

/**
 * Set default render variables for button case.
 * @param buttonProperties used to set the 'attributes' property.
 */
function getButtonRenderVariables(buttonProperties: ButtonProperties): LinkButtonRenderVariables {
  return {
    tagName: 'button',
    attributes: getButtonAttributeList(buttonProperties),
    hostAttributes: Object.assign(
      { role: 'button' },
      !buttonProperties.disabled ? { tabIndex: '0' } : undefined
    ),
  };
}

/** Set default render variables when the element is static (button/link inside another button/link). */
function getLinkButtonStaticRenderVariables(): LinkButtonRenderVariables {
  return {
    tagName: 'span',
    attributes: getLinkButtonBaseAttributeList(),
  };
}

/**
 * Set default render variables based on the 'default' condition, checking first `isStatic` property, then the `href`.
 * @param properties used to set the 'attributes' property and to check for `href` value.
 */
export function resolveRenderVariables(
  properties: LinkButtonProperties & Partial<IsStaticProperty>
): LinkButtonRenderVariables {
  if (properties.isStatic) {
    return getLinkButtonStaticRenderVariables();
  } else if (properties.href) {
    return getLinkRenderVariables(properties);
  }
  return getButtonRenderVariables(properties);
}

/**
 * Returns the link render variables or static variables if there is no href property.
 * @param linkProperties used to set variables and to check if href property is set.
 * @param currentLanguage language for accessibility texts.
 */
export function resolveLinkRenderVariables(
  linkProperties: LinkProperties
): LinkButtonRenderVariables {
  if (linkProperties.href) {
    return getLinkRenderVariables(linkProperties);
  }
  return getLinkButtonStaticRenderVariables();
}

/**
 * Forwards a click on the host element to the nested action element in order to
 * simplify the API.
 */
export function forwardHostEvent(
  event: Event,
  host: HTMLElement,
  nestedActionElement: HTMLElement
): void {
  // Check if the click was triggered on the host element and not from inside the shadow DOM.
  // The composed path includes the full path to the clicked element including shadow DOM.
  if (event.composedPath()[0] !== host) {
    return;
  }
  const eventConstructor = Object.getPrototypeOf(event).constructor;
  let copiedEvent: Event;

  if (event.cancelable) {
    // If the event is cancelable, we immediatly cancel it, copy it and dispatch it on the nested
    // action element. As all of our intended forwardable event types bubble, this ensures
    // that an event which was dispatched on host, is forwarded to the intended nested action
    // element and consumers can still add event listeners and deal with the bubbling event
    // as desired.
    event.preventDefault();
    event.stopImmediatePropagation();
    copiedEvent = new eventConstructor(event.type, event);
  } else {
    // If the event cannot be cancelled, we just copy it and dispatch it non-bubbling on the nested
    // action element. This ensures that an event that was programmatically dispatched on the host
    // is also dispatched on the intended nested action element.
    copiedEvent = new eventConstructor(event.type);
  }

  nestedActionElement.dispatchEvent(copiedEvent);
}

/**
 * Dispatches a 'click' PointerEvent, if the original keyboard event is a 'Enter' press.
 * As verified with the native button, when 'Enter' is pressed, a 'click' event is dispatched
 * after the 'keypress' event.
 * @param event The origin event.
 */
export function dispatchClickEventWhenEnterKeypress(event: KeyboardEvent): void {
  if (event.key === 'Enter') {
    (event.target as Element).dispatchEvent(
      new PointerEvent('click', { bubbles: true, cancelable: true, composed: true })
    );
  }
}

/**
 * Dispatches a 'click' PointerEvent, if the original keyboard event is a 'Space' press.
 * As verified with the native button, when 'Space' is pressed, a 'click' event is dispatched
 * after the 'keyup' event.
 * @param event The origin event.
 */
export function dispatchClickEventWhenButtonAndSpaceKeyup(event: KeyboardEvent): void {
  if (event.key === ' ' && !(event.target as Element & { href?: string }).href) {
    (event.target as Element).dispatchEvent(
      new PointerEvent('click', { bubbles: true, cancelable: true, composed: true })
    );
  }
}

/**
 * Trigger an anchor element click after the event has finished the bubbling phase and
 * preventDefault() has not been called for the event.
 */
async function triggerAnchorWhenNecessary(event: Event): Promise<void> {
  const target = event.target as Element;
  const composedTarget = event.composedPath()[0] as Element;
  // We only want to trigger a click event on the inner anchor element, if the host element is the
  // event origin, which means the inner anchor element has not actually been activated/clicked.
  if (!target.tagName.startsWith('SBB-') || target !== composedTarget) {
    return;
  }
  // We need for the event phase to finish, which is the
  // case after a micro task (e.g. await Promise).
  await Promise.resolve();
  if (event.defaultPrevented) {
    return;
  }

  // We are using dispatchEvent here, instead of just .click() in order to
  // prevent another click event from bubbling up the DOM tree.
  target.shadowRoot.querySelector('a').dispatchEvent(new PointerEvent('click'));
}

/** Handle the click logic for an action element. */
export function handleLinkButtonClick(event: Event): void {
  const element = event.target as HTMLElement & Partial<LinkButtonProperties & IsStaticProperty>;
  if (element.isStatic) {
    return;
  } else if (element.disabled) {
    event.preventDefault();
    event.stopImmediatePropagation();
    return;
  } else if (element.href) {
    triggerAnchorWhenNecessary(event);
    return;
  } else if (element.type === 'button') {
    return;
  }

  // Use querySelector with form and id selector, as the form property must
  // reference a valid <form> element
  const form = element.form
    ? (element.ownerDocument.querySelector(`form#${element.form}`) as HTMLFormElement)
    : element.closest('form');
  if (!form) {
    return;
  } else if (element.type === 'submit') {
    if (form.requestSubmit) {
      form.requestSubmit(element);
    } else {
      form.submit();
    }
  } else if (element.type === 'reset') {
    form.reset();
  }
}
