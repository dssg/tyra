let prettifyMetricParam = function(param) {
  if(param.endsWith('_abs')) {
    return 'top ' + param.replace('_abs', '')
  } else if(param.endsWith('_pct')) {
    return 'top ' + param.replace('_pct', '%')
  } else {
    return param
  }
}
export default function(metric) {
  let parts = metric.split('@')
  if(parts.length === 2) {
    return parts[0] + '@' + prettifyMetricParam(parts[1])
  } else {
    return metric
  }
}
