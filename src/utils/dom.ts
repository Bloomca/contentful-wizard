import { IStyle } from "../types";
import { animate } from "./animate";

export function renderOverlay({
  node,
  style
}: {
  node: HTMLElement;
  style?: IStyle;
}) {
  const { bottom, top, left, right } = node.getBoundingClientRect();

  const offsetY = window.pageYOffset;
  const offsetX = window.pageXOffset;

  const overlay = createElement({
    style: Object.assign({}, style, {
      top: `${offsetY + top}px`,
      height: `${bottom - top}px`,
      left: `${offsetX + left}px`,
      width: `${right - left}px`
    })
  });

  document.body.appendChild(overlay);

  animate({
    node: overlay,
    start: 0,
    stop: 0.25
  });

  return async () => {
    try {
      await animate({
        node: overlay,
        start: 0.25,
        stop: 0
      });
      document.body.removeChild(overlay);
    } catch (e) {
      // tslint:disable-next-line no-console
      console.log("error during removing overlay::", e);
    }
  };
}

export function applyStyle({
  node,
  style
}: {
  node: HTMLElement;
  style?: { [key: string]: string } | IStyle;
}): void {
  Object.assign(node.style, style);
}

export function createElement(
  {
    tag = "div",
    text,
    style,
    attrs
  }: {
    tag?:
      | "div"
      | "img"
      | "a"
      | "h1"
      | "h2"
      | "h3"
      | "h4"
      | "h5"
      | "h6"
      | "span";
    text?: HTMLElement | string | null;
    style?: { [key: string]: string };
    attrs?: { [key: string]: string };
  } = {}
): HTMLElement {
  const element = document.createElement(tag);
  if (text && typeof text === "string") {
    element.innerHTML = text;
  } else if (text && typeof text === "object") {
    element.appendChild(text);
  }

  if (style) {
    applyStyle({
      node: element,
      style
    });
  }

  if (attrs) {
    Object.keys(attrs).forEach(attr => {
      const value = attrs[attr];

      element.setAttribute(attr, value);
    });
  }

  return element;
}

export function measureHeight(content: HTMLElement | string): number {
  const container = createElement({
    style: {
      position: "absolute",
      visibility: "hidden"
    },
    text: content
  });

  document.body.appendChild(container);

  const { height } = container.getBoundingClientRect();

  document.body.removeChild(container);

  return height;
}

export function containsNode({
  node,
  checkingNode
}: {
  node: HTMLElement;
  checkingNode: HTMLElement;
}) {
  let inspectingNode: HTMLElement | null = checkingNode;
  while (inspectingNode !== null) {
    if (inspectingNode === node) {
      return true;
    }

    inspectingNode = inspectingNode.parentElement;
  }

  return false;
}

export function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}
