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
}

let myArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let myBST = new BinarySearchTree(myArray);

console.log("Initial Tree:");
myBST.prettyPrint();

// Insert a new value
console.log("\nInserting 10...");
myBST.insert(10);
myBST.prettyPrint();

// Try inserting a duplicate (should not change the tree)
console.log("\nInserting duplicate value 23...");
myBST.insert(23);
myBST.prettyPrint();

// Delete a leaf node
console.log("\nDeleting leaf node 1...");
myBST.deleteItem(1);
myBST.prettyPrint();

// Delete a node with one child
console.log("\nDeleting node 3 (has one child)...");
myBST.deleteItem(3);
myBST.prettyPrint();

// Delete a node with two children
console.log("\nDeleting node 4 (has two children)...");
myBST.deleteItem(4);
myBST.prettyPrint();

// Search for a value
console.log("\nSearching for 10...");
let foundNode = myBST.find(10);
console.log(
  foundNode ? `Found node with data: ${foundNode.data}` : "Node not found."
);

// Search for a value that doesn’t exist
console.log("\nSearching for 999...");
foundNode = myBST.find(999);
console.log(
  foundNode ? `Found node with data: ${foundNode.data}` : "Node not found."
);

// breadth first examples
console.log("\n📚 Level Order Traversal (Iterative):");
myBST.levelOrder((node) => console.log(node.data));

console.log("\n📚 Level Order Traversal (Recursive):");
myBST.levelOrderR((node) => console.log(node.data));

// In-Order Traversal Example
console.log("\n📚 In-Order Traversal:");
myBST.inOrder((data) => console.log(data));

// Pre-Order Traversal Example
console.log("\n📚 Pre-Order Traversal:");
myBST.preOrder((data) => console.log(data));

// Post-Order Traversal Example
console.log("\n📚 Post-Order Traversal:");
myBST.postOrder((data) => console.log(data));
