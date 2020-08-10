import * as d3 from 'd3';

// <g v-axis:x = {scale: (required), ticks: , padding}

// eslint-disable-next-line import/prefer-default-export
export function axisDirective(el, binding) {
  const axisKey = binding.arg;
  const axisMethod = { x: 'axisBottom', y: 'axisLeft', top: 'axisTop' }[axisKey];
  const methodArg = binding.value.scale;

  const {
    ticks = 11, padding = 3, tickFormat = null, inner = 6, ticksAmount,
  } = binding.value;

  // 选项，参考：
  // https://github.com/d3/d3/wiki/SVG-%E8%BD%B4#axis
  const axis = d3[axisMethod](methodArg)
    .ticks(ticks)
    .tickSize(inner)
    .tickPadding(padding)
    .tickFormat(tickFormat);

  if (ticksAmount !== undefined) {
    // 如果显式设置了坐标轴的数量
    const domain = methodArg.domain();
    const tickStep = (domain[1] - domain[0]) / (ticksAmount);
    const step = Math.ceil(tickStep / 5) * 5;
    axis.tickValues(d3.range(domain[0], domain[1] + step, step));
  }

  d3.select(el).call(axis);
}
