// 创建一个元素对象，包含类型、属性和子元素
function createElement(type, props, ...children) {
  return {
    // 元素类型，如 'div'、'p' 或自定义组件
    type,
    // 元素的属性对象，包含所有传入的属性和值
    props: {
      ...props,
      // 将子元素包装成对象数组
      children: children.map((child) =>
        // 如果子元素是对象（即已经是元素对象），直接返回
        // 如果子元素是文本，调用 createTextElement 创建文本元素对象
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

// 创建一个文本元素，用于包装纯文本节点
function createTextElement(text) {
  return {
    // 文本节点的类型标识为 "TEXT_ELEMENT"
    type: "TEXT_ELEMENT",
    // 文本节点的属性对象
    props: {
      // 文本节点的值
      nodeValue: text,
      // 文本节点没有子元素，children 为空数组
      children: [],
    },
  };
}

// 根据 Fiber 节点创建实际的 DOM 节点
function createDom(fiber) {
  // 如果 Fiber 节点是文本元素，则创建文本节点
  // 否则，根据元素类型创建普通的 DOM 元素
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  // 初始化 DOM 节点的属性和事件
  updateDom(dom, {}, fiber.props);

  // 返回创建的 DOM 节点
  return dom;
}

// 判断属性是否为事件监听器，如 'onClick'
const isEvent = (key) => key.startsWith("on");

// 判断属性是否为普通属性（非事件、非子节点）
const isProperty = (key) => key !== "children" && !isEvent(key);

// 判断属性是否是新的或已更新
const isNew = (prev, next) => (key) => prev[key] !== next[key];

// 判断属性是否已被删除
const isGone = (prev, next) => (key) => !(key in next);

// 更新 DOM 节点的属性和事件
function updateDom(dom, prevProps, nextProps) {
  // 移除旧的或已更改的事件监听器
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) => {
      // 从事件监听器名称中提取事件类型（如 'onClick' 变为 'click'）
      const eventType = name.toLowerCase().substring(2);
      // 移除旧的事件监听器
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧的属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      // 将属性值重置为空
      dom[name] = "";
    });

  // 设置新的或已更改的属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      // 将新的属性值赋予 DOM 节点
      dom[name] = nextProps[name];
    });

  // 添加新的事件监听器
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      // 从事件监听器名称中提取事件类型（如 'onClick' 变为 'click'）
      const eventType = name.toLowerCase().substring(2);
      // 添加新的事件监听器
      dom.addEventListener(eventType, nextProps[name]);
    });
}

// 提交所有的更新并将其渲染到 DOM 中
function commitRoot() {
  // 先处理所有需要删除的节点
  deletions.forEach(commitWork);
  // 从根节点开始递归提交所有更新
  commitWork(wipRoot.child);
  // 将当前 Fiber 树保存为旧树
  currentRoot = wipRoot;
  // 重置工作中的根节点
  wipRoot = null;
}

// 提交单个 Fiber 节点的工作
function commitWork(fiber) {
  // 如果当前 Fiber 为空，直接返回
  if (!fiber) {
    return;
  }

  // 找到父级 DOM 节点
  const domParent = fiber.parent.dom;
  if (fiber.effectTag === "PLACEMENT" && fiber.dom != null) {
    // 如果当前 Fiber 需要新增节点，直接将其插入到父节点中
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    // 如果当前 Fiber 需要更新节点，调用 updateDom 进行更新
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    // 如果当前 Fiber 需要删除节点，从父节点中移除
    domParent.removeChild(fiber.dom);
  }

  // 递归处理子节点和兄弟节点
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

// 初始化全局变量
let nextUnitOfWork = null; // 下一个工作单元
let currentRoot = null; // 当前 Fiber 树的根节点
let wipRoot = null; // 工作中的 Fiber 树的根节点
let deletions = null; // 需要删除的 Fiber 节点

// 渲染元素到容器中
function render(element, container) {
  // 初始化根 Fiber 节点
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot, // 保存旧的 Fiber 树，方便进行对比更新
  };
  deletions = []; // 初始化删除列表
  nextUnitOfWork = wipRoot; // 将根节点作为第一个工作单元
}

// 浏览器空闲时调用的主循环，处理工作单元
function workLoop(deadline) {
  let shouldYield = false; // 标识是否需要让出控制权
  while (nextUnitOfWork && !shouldYield) {
    // 执行一个工作单元，并返回下一个工作单元
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    // 检查剩余时间，如果不足，应该让出控制权
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    // 如果所有工作单元都完成且有待提交的 Fiber 树，提交更新
    commitRoot();
  }

  // 请求下一个空闲回调，继续执行工作单元
  requestIdleCallback(workLoop);
}

// 开始执行工作单元的主循环
requestIdleCallback(workLoop);

// 执行单个工作单元
function performUnitOfWork(fiber) {
  // 如果当前 Fiber 节点还没有对应的 DOM 节点，创建它
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  // 获取子元素
  const elements = fiber.props.children;
  // 调和子元素，创建新的 Fiber 树或更新现有 Fiber 树
  reconcileChildren(fiber, elements);

  // 如果有子节点，返回第一个子节点作为下一个工作单元
  if (fiber.child) {
    return fiber.child;
  }
  // 否则，逐级返回兄弟节点，如果没有兄弟节点，返回父节点的兄弟节点
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

// 调和子元素，创建新的 Fiber 树或更新现有 Fiber 树
function reconcileChildren(wipFiber, elements) {
  let index = 0; // 子元素索引
  let oldFiber = wipFiber.alternate && wipFiber.alternate.child; // 旧的子节点
  console.log("wipFiber.alternate", wipFiber.alternate);

  let prevSibling = null; // 用于保存上一个兄弟节点

  // 遍历所有新元素或旧 Fiber 节点
  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 检查当前索引处的新元素和旧 Fiber 节点类型是否相同
    const sameType = oldFiber && element && element.type == oldFiber.type;

    if (sameType) {
      // 如果类型相同，创建新的 Fiber 节点并保留 DOM 节点
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE", // 标记为更新
      };
    }
    if (element && !sameType) {
      // 如果类型不同，创建新的 Fiber 节点并标记为新增
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT", // 标记为新增
      };
    }
    if (oldFiber && !sameType) {
      // 如果旧 Fiber 节点存在且类型不同，标记为删除
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber); // 将旧 Fiber 节点添加到删除列表
    }

    // 如果有旧 Fiber 节点，移动到下一个兄弟节点
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    // 将新创建的 Fiber 节点设置为当前 Fiber 节点的子节点或兄弟节点
    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    // 将当前 Fiber 节点保存为上一个兄弟节点
    prevSibling = newFiber;
    index++;
  }
}

// 自定义的渲染器对象，包含 createElement 和 render 方法
const Didact = {
  createElement,
  render,
};

/** @jsx Didact.createElement */
const container = document.getElementById("root");

const updateValue = (e) => {
  rerender(e.target.value);
};

const rerender = (value) => {
  const element = (
    <div>
      <p>Hello {value}</p>
      <input onInput={updateValue} value={value} />
    </div>
  );
  Didact.render(element, container);
};

rerender("react");
