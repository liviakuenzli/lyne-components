/* eslint-disable */
/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */
import { HTMLStencilElement, JSXBase } from "@stencil/core/internal";
import { InterfaceButtonAttributes } from "./components/lyne-button/lyne-button.custom.d";
import { Time } from "./components/lyne-clock/lyne-clock.custom.d";
import { InterfaceHeadingAttributes } from "./components/lyne-heading/lyne-heading.custom.d";
export namespace Components {
    interface LyneButton {
        /**
          * If you use the button to trigger another widget which itself is covering the page, you must provide an according attribute for aria-haspopup.
         */
        "ariaHaspopup"?: InterfaceButtonAttributes['popup'];
        /**
          * Set to true to get a disabled button
         */
        "disabled"?: boolean;
        /**
          * Id which is sent in the click event payload
         */
        "eventId"?: string;
        /**
          * Define if icon should be shown or not
         */
        "icon"?: boolean;
        /**
          * If you use an icon without a label, you must provide an iconDescription
         */
        "iconDescription"?: string;
        /**
          * Label text to show on the button
         */
        "label"?: string;
        /**
          * The name attribute to use for the button
         */
        "name"?: string;
        /**
          * Size variant, either large or small.
         */
        "size"?: InterfaceButtonAttributes['size'];
        /**
          * The type attribute to use for the button
         */
        "type"?: InterfaceButtonAttributes['type'];
        /**
          * The value attribute to use for the button
         */
        "value"?: string;
        /**
          * Variant of the button, like primary, secondary etc.
         */
        "variant"?: InterfaceButtonAttributes['variant'];
    }
    interface LyneClock {
        /**
          * initialTime accepts a string following a ${number}:${number}:${number} pattern. If left empty or the string 'now' is used we will set the current time the client has on its device.
         */
        "initialTime"?: Time;
        /**
          * If set to true, the clock will be paused.
         */
        "paused"?: boolean;
    }
    interface LyneHeading {
        /**
          * Heading level
         */
        "level": InterfaceHeadingAttributes['level'];
        /**
          * Text for the Heading
         */
        "text": string;
        /**
          * Visual level for the heading
         */
        "visualLevel": InterfaceHeadingAttributes['visualLevel'];
    }
    interface LyneLink {
        /**
          * Link to use as href
         */
        "link": string;
        /**
          * If true, target=_blank will be set on the link
         */
        "openInNewWindow": boolean;
        /**
          * Text to show for the link
         */
        "text": string;
    }
    interface LynePanel {
    }
}
declare global {
    interface HTMLLyneButtonElement extends Components.LyneButton, HTMLStencilElement {
    }
    var HTMLLyneButtonElement: {
        prototype: HTMLLyneButtonElement;
        new (): HTMLLyneButtonElement;
    };
    interface HTMLLyneClockElement extends Components.LyneClock, HTMLStencilElement {
    }
    var HTMLLyneClockElement: {
        prototype: HTMLLyneClockElement;
        new (): HTMLLyneClockElement;
    };
    interface HTMLLyneHeadingElement extends Components.LyneHeading, HTMLStencilElement {
    }
    var HTMLLyneHeadingElement: {
        prototype: HTMLLyneHeadingElement;
        new (): HTMLLyneHeadingElement;
    };
    interface HTMLLyneLinkElement extends Components.LyneLink, HTMLStencilElement {
    }
    var HTMLLyneLinkElement: {
        prototype: HTMLLyneLinkElement;
        new (): HTMLLyneLinkElement;
    };
    interface HTMLLynePanelElement extends Components.LynePanel, HTMLStencilElement {
    }
    var HTMLLynePanelElement: {
        prototype: HTMLLynePanelElement;
        new (): HTMLLynePanelElement;
    };
    interface HTMLElementTagNameMap {
        "lyne-button": HTMLLyneButtonElement;
        "lyne-clock": HTMLLyneClockElement;
        "lyne-heading": HTMLLyneHeadingElement;
        "lyne-link": HTMLLyneLinkElement;
        "lyne-panel": HTMLLynePanelElement;
    }
}
declare namespace LocalJSX {
    interface LyneButton {
        /**
          * If you use the button to trigger another widget which itself is covering the page, you must provide an according attribute for aria-haspopup.
         */
        "ariaHaspopup"?: InterfaceButtonAttributes['popup'];
        /**
          * Set to true to get a disabled button
         */
        "disabled"?: boolean;
        /**
          * Id which is sent in the click event payload
         */
        "eventId"?: string;
        /**
          * Define if icon should be shown or not
         */
        "icon"?: boolean;
        /**
          * If you use an icon without a label, you must provide an iconDescription
         */
        "iconDescription"?: string;
        /**
          * Label text to show on the button
         */
        "label"?: string;
        /**
          * The name attribute to use for the button
         */
        "name"?: string;
        /**
          * Size variant, either large or small.
         */
        "size"?: InterfaceButtonAttributes['size'];
        /**
          * The type attribute to use for the button
         */
        "type"?: InterfaceButtonAttributes['type'];
        /**
          * The value attribute to use for the button
         */
        "value"?: string;
        /**
          * Variant of the button, like primary, secondary etc.
         */
        "variant"?: InterfaceButtonAttributes['variant'];
    }
    interface LyneClock {
        /**
          * initialTime accepts a string following a ${number}:${number}:${number} pattern. If left empty or the string 'now' is used we will set the current time the client has on its device.
         */
        "initialTime"?: Time;
        /**
          * If set to true, the clock will be paused.
         */
        "paused"?: boolean;
    }
    interface LyneHeading {
        /**
          * Heading level
         */
        "level"?: InterfaceHeadingAttributes['level'];
        /**
          * Text for the Heading
         */
        "text"?: string;
        /**
          * Visual level for the heading
         */
        "visualLevel"?: InterfaceHeadingAttributes['visualLevel'];
    }
    interface LyneLink {
        /**
          * Link to use as href
         */
        "link": string;
        /**
          * If true, target=_blank will be set on the link
         */
        "openInNewWindow"?: boolean;
        /**
          * Text to show for the link
         */
        "text": string;
    }
    interface LynePanel {
    }
    interface IntrinsicElements {
        "lyne-button": LyneButton;
        "lyne-clock": LyneClock;
        "lyne-heading": LyneHeading;
        "lyne-link": LyneLink;
        "lyne-panel": LynePanel;
    }
}
export { LocalJSX as JSX };
declare module "@stencil/core" {
    export namespace JSX {
        interface IntrinsicElements {
            "lyne-button": LocalJSX.LyneButton & JSXBase.HTMLAttributes<HTMLLyneButtonElement>;
            "lyne-clock": LocalJSX.LyneClock & JSXBase.HTMLAttributes<HTMLLyneClockElement>;
            "lyne-heading": LocalJSX.LyneHeading & JSXBase.HTMLAttributes<HTMLLyneHeadingElement>;
            "lyne-link": LocalJSX.LyneLink & JSXBase.HTMLAttributes<HTMLLyneLinkElement>;
            "lyne-panel": LocalJSX.LynePanel & JSXBase.HTMLAttributes<HTMLLynePanelElement>;
        }
    }
}
