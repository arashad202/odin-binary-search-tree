class Node {
  constructor(data) {
    this.data = data;
    this.leftNode = null;
    this.rightNode = null;
  }
}

class BinarySearchTree {
  constructor(myArray) {
    this.myArray = myArray;
    this.root = this.buildTree(myArray);
  }

  buildTree(array) {
    // make array unique and sorted
    let mySortedUniqueArray = [...new Set(array)].sort((a, b) => a - b);

    if (mySortedUniqueArray.length == 0) return null;

    let mid = Math.floor(mySortedUniqueArray.length / 2);
    let midElement = mySortedUniqueArray[mid];

    let root = new Node(midElement);
    let leftSubArray = mySortedUniqueArray.slice(0, mid);
    let rightSubArray = mySortedUniqueArray.slice(mid + 1);

    root.leftNode = this.buildTree(leftSubArray);
    root.rightNode = this.buildTree(rightSubArray);

    return root;
  }

  prettyPrint(node = this.root, prefivalue = "", isLeft = true) {
    if (node === null) {
      return;
    }
    if (node.rightNode !== null) {
      this.prettyPrint(
        node.rightNode,
        `${prefivalue}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefivalue}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.leftNode !== null) {
      this.prettyPrint(
        node.leftNode,
        `${prefivalue}${isLeft ? "    " : "│   "}`,
        true
      );
    }
  }

  insert(value) {
    this.root = this.insertNode(this.root, value);
  }

  insertNode(root, value) {
    if (root == null) {
      return new Node(value);
    }

    if (root.data == value) {
      return root;
    }

    if (value < root.data) {
      root.leftNode = this.insertNode(root.leftNode, value);
    } else if (value > root.data) {
      root.rightNode = this.insertNode(root.rightNode, value);
    }

    return root;
  }

  getSuccessor(curr) {
    curr = curr.rightNode;
    while (curr !== null && curr.leftNode !== null) {
      curr = curr.leftNode;
    }
    return curr;
  }

  deleteItem(value) {
    this.root = this.delNode(this.root, value);
  }

  delNode(root, value) {
    // Base case
    if (root === null) {
      return root;
    }

    // If key to be searched is in a subtree
    if (root.data > value) {
      root.leftNode = this.delNode(root.leftNode, value);
    } else if (root.data < value) {
      root.rightNode = this.delNode(root.rightNode, value);
    } else {
      // If root matches with the given key

      // Cases when root has 0 children or
      // only right child
      if (root.leftNode === null) return root.rightNode;

      // When root has only left child
      if (root.rightNode === null) return root.leftNode;

      // When both children are present
      let succ = this.getSuccessor(root);
      root.data = succ.data;
      root.rightNode = this.delNode(root.rightNode, succ.data);
    }
    return root;
  }

  find(value) {
    return this.findValue(value, this.root);
  }

  findValue(value, node) {
    if (node === null || node.data === value) return node;
    if (value < node.data) return this.findValue(value, node.leftNode);
    return this.findValue(value, node.rightNode);
  }

  // Breadth first traversal
  // iterative implementation

  // helper function
  levelOrderIter(root, cb) {
    // base case if node is null return
    if (root === null) return;

    // initialize queue
    const queue = [root];

    while (queue.length > 0) {
      // dequeue the next node
      const node = queue.shift();
      // run the callback on the node
      cb(node);

      // enqueue its children
      if (node.leftNode) queue.push(node.leftNode);
      if (node.rightNode) queue.push(node.rightNode);
    }
  }

  // function to perform level order traversal with call back only
  levelOrder(cb) {
    if (typeof cb !== "function") {
      throw new Error("A callback function is required");
    }
    this.levelOrderIter(this.root, cb);
  }

  // recursive implementation
  levelOrderRecursive(root, callback) {
    if (!root) return;

    function height(node) {
      if (!node) return 0;
      return 1 + Math.max(height(node.leftNode), height(node.rightNode));
    }

    function visitLevel(node, level) {
      if (!node) return;
      if (level === 1) {
        callback(node);
      } else {
        visitLevel(node.leftNode, level - 1);
        visitLevel(node.rightNode, level - 1);
      }
    }

    const h = height(root);
    for (let i = 1; i <= h; i++) {
      visitLevel(root, i);
    }
  }

  levelOrderR(cb) {
    if (typeof cb !== "function") {
      throw new Error("A callback function is required");
    }
    this.levelOrderRecursive(this.root, cb);
  }

  // in order
  // in order helper
  inOrderHelper(root, cb) {
    if (root == null) return;
    this.inOrderHelper(root.leftNode, cb);
    cb(root.data);
    this.inOrderHelper(root.rightNode, cb);
  }

  // in order
  inOrder(cb) {
    if (typeof cb !== "function") {
      throw new Error("A callback function is required");
    }
    this.inOrderHelper(this.root, cb);
  }

  // pre order helper
  preOrderHelper(root, cb) {
    if (root == null) return;
    cb(root.data);
    this.preOrderHelper(root.leftNode, cb);
    this.preOrderHelper(root.rightNode, cb);
  }

  // pre order
  preOrder(cb) {
    if (typeof cb !== "function") {
      throw new Error("A callback function is required");
    }
    this.preOrderHelper(this.root, cb);
  }

  // post order helper
  postOrderHelper(root, cb) {
    if (root == null) return;
    this.postOrderHelper(root.leftNode, cb);
    this.postOrderHelper(root.rightNode, cb);
    cb(root.data);
  }

  // pre order
  postOrder(cb) {
    if (typeof cb !== "function") {
      throw new Error("A callback function is required");
    }
    this.postOrderHelper(this.root, cb);
  }

  // height helper
  heightHelper(node) {
    if (!node) return -1;
    return (
      1 +
      Math.max(
        this.heightHelper(node.leftNode),
        this.heightHelper(node.rightNode)
      )
    );
  }

  // height from root to leaf
  height(value) {
    const node = this.find(value);
    if (!node) return null;

    return this.heightHelper(node);
  }

  // depth from root to leaf
  depth(value) {
    let depth = 0;
    let current = this.root;

    while (current) {
      if (value == current.data) return depth;
      current = value < current.data ? current.leftNode : current.rightNode;
      depth++;
    }

    return null;
  }

  // is balanced helper
  isBalancedHelper(node) {
    if (!node) return { height: 0, balanced: true };

    const left = this.isBalancedHelper(node.leftNode);
    const right = this.isBalancedHelper(node.rightNode);

    const balanced =
      left.balanced &&
      right.balanced &&
      Math.abs(left.height - right.height) <= 1;

    return {
      height: 1 + Math.max(left.height, right.height),
      balanced,
    };
  }

  // is balanced
  isBalanced() {
    return this.isBalancedHelper(this.root).balanced;
  }

  // rebalance
  reBalance() {
    const values = [];
    this.inOrder((val) => values.push(val));
    this.root = this.buildTree(values);
  }
}

// ✅ DRIVER SCRIPT

function randomArray(size, max = 100) {
  return Array.from({ length: size }, () => Math.floor(Math.random() * max));
}

const initialArray = randomArray(15);
const tree = new BinarySearchTree(initialArray);

console.log("🌳 Initial Tree:");
tree.prettyPrint();

console.log("\n✅ Is balanced?", tree.isBalanced());

console.log("\n📦 Level Order:");
tree.levelOrder((val) => console.log(val));

console.log("\n📦 Pre Order:");
tree.preOrder((val) => console.log(val));

console.log("\n📦 In Order:");
tree.inOrder((val) => console.log(val));

console.log("\n📦 Post Order:");
tree.postOrder((val) => console.log(val));

// Unbalance the tree
console.log("\n⚠️ Unbalancing the tree...");
tree.insert(120);
tree.insert(130);
tree.insert(140);
tree.insert(150);
tree.insert(160);

console.log("\n🌲 Unbalanced Tree:");
tree.prettyPrint();

console.log("\n❌ Is balanced?", tree.isBalanced());

// Rebalance
console.log("\n🔁 Rebalancing tree...");
tree.reBalance();

console.log("\n🌳 Rebalanced Tree:");
tree.prettyPrint();

console.log("\n✅ Is balanced?", tree.isBalanced());

console.log("\n📦 Level Order:");
tree.levelOrder((val) => console.log(val));

console.log("\n📦 Pre Order:");
tree.preOrder((val) => console.log(val));

console.log("\n📦 In Order:");
tree.inOrder((val) => console.log(val));

console.log("\n📦 Post Order:");
tree.postOrder((val) => console.log(val));

// Height and depth examples
const sample = tree.root.data;
console.log(`\n📏 Height of root (${sample}):`, tree.height(sample));
console.log(`📐 Depth of root (${sample}):`, tree.depth(sample));

const testLeaf = 120;
console.log(`\n📏 Height of ${testLeaf}:`, tree.height(testLeaf));
console.log(`📐 Depth of ${testLeaf}:`, tree.depth(testLeaf));
