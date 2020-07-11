import * as d3 from 'd3';

// <g v-axis:x = {scale: (required), ticks: , padding}

// eslint-disable-next-line import/prefer-default-export
export function axisDirective(el, binding) {
  const axisKey = binding.arg;
  const axisMethod = { x: 'axisBottom', y: 'axisLeft' }[axisKey];
  const methodArg = binding.value.scale;

  const { ticks = 11, padding = 3, tickFormat = null } = binding.value;

  // 暂时只设置了两个选项，参考：
  // https://github.com/d3/d3/wiki/SVG-%E8%BD%B4#axis
  const axis = d3[axisMethod](methodArg)
    .ticks(ticks)
    .tickPadding(padding)
    .tickFormat(tickFormat);

  d3.select(el).call(axis);
}
