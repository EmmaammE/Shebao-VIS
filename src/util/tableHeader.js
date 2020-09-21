// 表格的表头
const searchRankHeader = [
  // { text: '序号' },
  // {
  //   text: '机构基本情况',
  //   children: [
  //     { text: '机构名称' },
  //     { text: '机构编码' },
  //     { text: '地址' },
  //   ],
  // },
  {
    text: '医疗费用发生情况',
    children: [
      {
        text: '医药费用发生总体情况',
        children: [
          { text: '累计总医药费用发生数' },
          { text: '列支医药费用发生数' },
          { text: '总人头' },
          { text: '总人次' },
          { text: '人次人头比' },
          { text: '人均列支费用（元）' },
          { text: '次均列支费用(元)' },
        ],
      },
      {
        text: '按就诊类别分类情况',
        children: [
          {
            text: '住院情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
          {
            text: '门诊情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
          {
            text: '规定病种情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
          {
            text: '家庭病床情况',
            children: [
              { text: '列支费用' },
              { text: '人头数' },
              { text: '人次数' },
              { text: '人均费用' },
              { text: '均次费用' },
            ],
          },
        ],
      },
      {
        text: '按费用结构分类情况',
        children: [
          { text: '化验费及占比' },
          { text: '检查费及占比' },
          { text: '中医治疗费及占比' },
          { text: '物理治疗费及占比' },
          { text: '手术费及占比' },
          {
            text: '药品费及占比',
            children: [
              { text: '西药费及占比' },
              { text: '中成药费及占比' },
              { text: '中草药及占比' },
            ],
          },
          { text: '材料费及占比' },
          { text: '其他及占比' },
        ],
      },
    ],
  },
  {
    text: '总报销支出费用',
    children: [
      {
        text: '个人账户',
        children: [
          { text: '本年账户' },
          { text: '历年账户' },
        ],
      },
      { text: '统筹账户' },
      { text: '大病保险' },
      { text: '救助基金' },
      { text: '基金支付比例' },
    ],
  },
  {
    text: '个人现金支付',
    children: [
      { text: '现金支付总额' },
      { text: '现金支付比例' },
    ],
  },
];

// 获取header的col\row span
const getSpan = (trees = []) => {
  // 计算森林的深度
  let maxDepth = 1;
  const treesWithSpan = [];

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

    for (let i = treeInLevel.length - 1; i >= 0; i -= 1) {
      const nodes = treeInLevel[i];
      if (i === treeInLevel.length - 1) {
        // treeInLevel[i] = nodes.map((node) => ({ ...node, ...{ colspan: 1 } }));
        // eslint-disable-next-line no-loop-func
        treeInLevel[i] = nodes.map((node) => ({
          text: node.text,
          colspan: 1,
          rowspan: maxDepth - i,
        }));
      } else {
        // eslint-disable-next-line no-loop-func
        treeInLevel[i] = nodes.map((node) => {
          const spanArr = node.colspan;
          let colspan = 0;
          let rowspan = 1;
          // console.log(treeInLevel[i + 1]);
          for (let j = spanArr[0]; j < spanArr[1] + spanArr[0]; j += 1) {
            colspan += treeInLevel[i + 1][j].colspan;
          }

          if (colspan === 0) {
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

    treesWithSpan.push(treeInLevel);
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
export {
  getSpan,
  searchRankHeader,
};
