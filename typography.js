import {
  materializeRichInlineLineRange,
  prepareRichInline,
  walkRichInlineLineRanges,
} from "./vendor/pretext/rich-inline.js";

const TARGET_SELECTOR = [
  ".bio",
  ".hero-photo figcaption",
  ".news-list p",
  ".paper-content h3",
  ".authors",
  ".paper-summary",
  ".entry-role",
  ".entry-detail",
  ".entry-advisor",
  ".award-list li > span",
].join(", ");

const states = new WeakMap();
const pendingFrames = new WeakMap();

function numericPixels(value, fallback = 0) {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function makeFont(item, rootFontSize) {
  const size = rootFontSize * item.fontSizeRatio;
  return [
    item.fontStyle,
    item.fontWeight,
    `${size}px`,
    item.fontFamily,
  ].join(" ");
}

function cloneInlinePath(path, text) {
  let node = document.createTextNode(text);

  for (const source of path) {
    const clone = source.cloneNode(false);
    clone.removeAttribute("id");
    clone.appendChild(node);
    node = clone;
  }

  return node;
}

function collectSourceItems(element) {
  const rootStyle = window.getComputedStyle(element);
  const rootFontSize = numericPixels(rootStyle.fontSize, 16);
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const items = [];

  while (walker.nextNode()) {
    const textNode = walker.currentNode;
    const text = textNode.nodeValue || "";
    if (!text) continue;

    const parent = textNode.parentElement || element;
    const style = window.getComputedStyle(parent);
    const path = [];
    let cursor = parent;

    while (cursor && cursor !== element) {
      path.push(cursor);
      cursor = cursor.parentElement;
    }

    items.push({
      text,
      path,
      fontStyle: style.fontStyle || "normal",
      fontWeight: style.fontWeight || "400",
      fontFamily: style.fontFamily || rootStyle.fontFamily,
      fontSizeRatio: numericPixels(style.fontSize, rootFontSize) / rootFontSize,
      letterSpacing: style.letterSpacing === "normal"
        ? 0
        : numericPixels(style.letterSpacing),
    });
  }

  return items;
}

function prepareState(element) {
  const items = collectSourceItems(element);
  if (!items.length || !items.some((item) => item.text.trim())) return null;

  const state = {
    element,
    items,
    prepared: null,
    signature: "",
    lineHeight: 0,
    lastWidth: 0,
  };

  states.set(element, state);
  return state;
}

function refreshPrepared(state) {
  const style = window.getComputedStyle(state.element);
  const rootFontSize = numericPixels(style.fontSize, 16);
  const lineHeight = numericPixels(style.lineHeight, rootFontSize * 1.6);
  const signature = [
    rootFontSize,
    lineHeight,
    style.fontFamily,
    style.fontWeight,
  ].join("|");

  if (state.prepared && signature === state.signature) return;

  state.prepared = prepareRichInline(
    state.items.map((item) => ({
      text: item.text,
      font: makeFont(item, rootFontSize),
      letterSpacing: item.letterSpacing,
    }))
  );
  state.signature = signature;
  state.lineHeight = lineHeight;
}

function renderState(state, width) {
  if (!Number.isFinite(width) || width <= 0) return;

  refreshPrepared(state);
  const lineRanges = [];
  walkRichInlineLineRanges(state.prepared, width, (range) => {
    lineRanges.push(range);
  });
  if (!lineRanges.length) return;

  const fragment = document.createDocumentFragment();
  for (const range of lineRanges) {
    const line = materializeRichInlineLineRange(state.prepared, range);
    const lineElement = document.createElement("span");
    lineElement.className = "pretext-line";

    for (const part of line.fragments) {
      if (part.gapBefore > 0 && lineElement.childNodes.length) {
        lineElement.appendChild(document.createTextNode(" "));
      }
      const source = state.items[part.itemIndex];
      lineElement.appendChild(cloneInlinePath(source.path, part.text));
    }

    fragment.appendChild(lineElement);
  }

  state.element.replaceChildren(fragment);
  state.element.style.setProperty("--pretext-line-height", `${state.lineHeight}px`);
  state.element.style.setProperty(
    "--pretext-height",
    `${lineRanges.length * state.lineHeight}px`
  );
  state.element.dataset.pretextRendered = "true";
  state.element.dataset.pretextLines = String(lineRanges.length);
  state.lastWidth = width;
}

function scheduleRender(state, width) {
  if (Math.abs(width - state.lastWidth) < 0.5 && state.element.dataset.pretextRendered) {
    return;
  }

  const previousFrame = pendingFrames.get(state.element);
  if (previousFrame) window.cancelAnimationFrame(previousFrame);

  const frame = window.requestAnimationFrame(() => {
    pendingFrames.delete(state.element);
    try {
      renderState(state, width);
    } catch (reason) {
      state.element.dataset.pretextRendered = "error";
      console.warn("Pretext layout skipped for one text block.", reason);
    }
  });
  pendingFrames.set(state.element, frame);
}

async function initializePretext() {
  if (!("Segmenter" in Intl) || !document.createElement("canvas").getContext("2d")) {
    document.documentElement.dataset.pretextStatus = "unsupported";
    return;
  }

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }

  const targets = Array.from(document.querySelectorAll(TARGET_SELECTOR));
  const preparedStates = targets.map(prepareState).filter(Boolean);

  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const state = states.get(entry.target);
        if (state) scheduleRender(state, entry.contentRect.width);
      }
    });
    preparedStates.forEach((state) => observer.observe(state.element));
  } else {
    const renderAll = () => {
      preparedStates.forEach((state) => {
        scheduleRender(state, state.element.getBoundingClientRect().width);
      });
    };
    renderAll();
    window.addEventListener("resize", renderAll, { passive: true });
  }

  document.documentElement.dataset.pretextStatus = "ready";
}

initializePretext().catch((reason) => {
  document.documentElement.dataset.pretextStatus = "error";
  console.warn("Pretext typography initialization failed.", reason);
});
