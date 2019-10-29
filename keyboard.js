
function Keyboard(o) {
  if (!(this instanceof Keyboard))
    return new Keyboard(o);
  Object.assign(this, {
    meta: {}
  }, o);
  const { DEFAULT_LAYOUT } = Keyboard;
  this.layout = (o.layout || DEFAULT_LAYOUT);
  this.createElement();
  this.render();
  return this;
};

Keyboard.prototype.createElement = function () {
  const { theme = 'default', className } = this;
  this.element = document.createElement('div');
  this.element.classList.add(`keyboard`);
  this.element.classList.add(`keyboard-theme-${theme}`);
  className && this.element.classList.add(className);
  return this;
};

Keyboard.prototype.updateElement = function (layout) {
  for (var x in layout) {
    const row = layout[x];
    for (const y in row) {
      const key = this.createKey(row[y], { x, y });
      const old = document.getElementById(`keyboard-key-${x}-${y}`);
      old.parentNode.replaceChild(key, old);
    }
  }
  return this;
};

Keyboard.prototype.createRow = function (r, x) {
  const row = document.createElement('div');
  row.className = `keyboard-row keyboard-row-${x}`;
  for (const y in r) {
    const key = r[y];
    row.appendChild(this.createKey(key, { x, y }));
  }
  return row;
};

Keyboard.prototype.createKey = function (k, pos) {
  if (!(k instanceof Keyboard.Key))
    k = new Keyboard.Key(k);
  const key = document.createElement('span');
  key.id = `keyboard-key-${pos.x}-${pos.y}`;
  key.classList.add(`keyboard-key`);
  key.classList.add(`keyboard-key-${k.code}`);
  key.classList.add(`keyboard-key-pos-${pos.x}-${pos.y}`);
  key.classList.add(k.className);
  key.textContent = k.text;
  key.onclick = this.handleKey.bind(this, k);
  return key;
};

Keyboard.prototype.render = function () {
  var { target = document.body, layout } = this;
  for (const i in layout) {
    const row = layout[i];
    this.element.appendChild(this.createRow(row, i));
  }
  if (typeof target === 'string')
    target = document.querySelector(target);
  target.appendChild(this.element);
  return this;
};

Keyboard.prototype.createEvent = function (key) {
  return key;
};

Keyboard.prototype.handleKey = function (key, e) {
  const { action } = key;
  if (typeof action === 'function' && action.call(key, this, e)) return;
  const event = this.createEvent(key);
  this.handlers['keydown'].forEach(fn => fn.call(this, event));
  return this;
};

Keyboard.prototype.on = function (type, fn) {
  this.handlers = this.handlers || {};
  this.handlers[type] = this.handlers[type] || [];
  this.handlers[type].push(fn);
  return this;
};

Keyboard.Key = function (k) {
  if (typeof k === 'object') {
    Object.assign(this, k);
  } else {
    this.name = k;
    this.text = k;
    this.code = k.charCodeAt(0);
  }
  return this;
};

const shift = new Keyboard.Key({
  code: 'shift',
  name: 'shift',
  text: 'Shift',
  action(keyboard) {
    var { shift = false } = keyboard;
    const { DEFAULT_LAYOUT, SHIFT_LAYOUT } = Keyboard;
    keyboard.updateElement(shift ? DEFAULT_LAYOUT : SHIFT_LAYOUT);
    keyboard.shift = shift = !shift;
    const [left, right] = document.querySelectorAll(`.keyboard-key-shift`);
    left.classList[shift ? 'add' : 'remove']('keyboard-key-active');
    right.classList[shift ? 'add' : 'remove']('keyboard-key-active');
    return true;
  }
});

const capslock = new Keyboard.Key({
  code: 'caps',
  name: 'caps',
  text: 'Caps',
  action() {
    var { caps = false } = keyboard;
    const { DEFAULT_LAYOUT, CAPS_LAYOUT } = Keyboard;
    keyboard.updateElement(caps ? DEFAULT_LAYOUT : CAPS_LAYOUT);
    caps = keyboard.caps = !caps;
    const el = document.querySelector(`.keyboard-key-caps`);
    el.classList[caps ? 'add' : 'remove']('keyboard-key-active');
    return true;
  }
});

const line1 = ['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'];
const line2 = ['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'];

Keyboard.DEFAULT_LAYOUT = [
  line1,
  ['Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\'],
  [capslock, 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter'],
  [shift, 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', shift],
  ['Space']
];

Keyboard.CAPS_LAYOUT = [
  line1,
  line2,
  [capslock, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'],
  [shift, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', shift],
  ['Space']
];

Keyboard.SHIFT_LAYOUT = [
  ['~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace'],
  line2,
  [capslock, 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ':', '"', 'Enter'],
  [shift, 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '<', '>', '?', shift],
  ['Space']
];