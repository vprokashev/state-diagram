window.mLog = function(m, dim) {
  let calculatedDim = dim;
  if (!dim) {
    calculatedDim = Math.sqrt(m.length);
  }
  let str = '';
  for (let i = 0;i < m.length; i++) {
    str += m[i];
    if ((i+1) % calculatedDim !== 0) {
      str += '\t'
    }
    if ((i+1) % calculatedDim === 0) {
      str += '\n'
    }
  }
  console.log(str);
}
