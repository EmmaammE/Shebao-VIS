// 获取header的col\row span
const getSpan = (trees = []) => {
  // 计算森林的深度
  let maxDepth = 1;
  let treesWithSpan = [];

  trees.forEach((tree) => {
    // 树的深度
    let depth = 1;

    const queue = [];
    // 层次遍历形式的树
    const treeInLevel = [];
    queue.push(tree);

    while (queue.length) {
      const size = queue.length;
      const level = [];

      for (let i = 0; i < size; i += 1) {
        const node = queue.shift();

        // 该节点的colspan从下一层的哪个节点开始算，算几个
        if (level.length === 0) {
          node.colspan = [0, node.children ? node.children.length : 0];
        } else {
          const last = level[level.length - 1];

          node.colspan = [
            Math.max(last.colspan[0] + last.colspan[1], 0),
            node.children ? node.children.length : 0,
          ];
        }
        // node.colspan = node.children ? node.children.length : 1;

        level.push(node);

        if (node.children) {
          node.children.forEach((c) => {
            queue.push(c);
          });
        }
      }

      treeInLevel.push(level);
    }

    depth = treeInLevel.length;

    maxDepth = Math.max(maxDepth, depth);

    treesWithSpan.push(treeInLevel);
  });

  treesWithSpan = treesWithSpan.map((treeInLevel) => {
    for (let i = treeInLevel.length - 1; i >= 0; i -= 1) {
      const nodes = treeInLevel[i];
      if (i === treeInLevel.length - 1) {
        // treeInLevel[i] = nodes.map((node) => ({ ...node, ...{ colspan: 1 } }));
        // eslint-disable-next-line
        treeInLevel[i] = nodes.map((node) => ({
          text: node.text,
          colspan: 1,
          rowspan: maxDepth - i,
        }));
      } else {
        // eslint-disable-next-line
        treeInLevel[i] = nodes.map((node) => {
          const spanArr = node.colspan;
          let colspan = 0;
          let rowspan = 1;
          // console.log(treeInLevel[i + 1]);
          for (let j = spanArr[0]; j < spanArr[1] + spanArr[0]; j += 1) {
            colspan += treeInLevel[i + 1][j].colspan;
          }

          if (colspan < 2) {
            rowspan = maxDepth - i;
          }

          // return ({ ...node, ...{ colspan: Math.max(colspan, 1) } });
          return {
            text: node.text,
            colspan: Math.max(colspan, 1),
            rowspan,
          };
        });
      }
    }

    return treeInLevel;
  });

  const res = [];
  for (let i = 0; i < maxDepth; i += 1) {
    let tmp = [];
    treesWithSpan.forEach((t) => {
      if (t[i]) {
        tmp = tmp.concat(t[i]);
      }
    });

    res.push(tmp);
  }
  // colspan rowspan
  return {
    depth: maxDepth,
    trees: res,
  };
};

// const res = getSpan(searchRankHeader);
export default getSpan;
