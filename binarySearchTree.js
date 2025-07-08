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
}

let myArray = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let myBST = new BinarySearchTree(myArray);
myBST.prettyPrint();
