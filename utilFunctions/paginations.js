function getPaginationPageSize(size) {
  let totalSiz = +size;
  let PAGE_SIZE = 0;

  if (totalSiz <= 10) PAGE_SIZE = 0;
  else if (totalSiz <= 100 && totalSiz > 10) PAGE_SIZE = 10;
  else if (totalSiz <= 500 && totalSiz > 100) PAGE_SIZE = 50;
  else if (totalSiz <= 1000 && totalSiz > 500) PAGE_SIZE = 100;
  else if (totalSiz <= 2000 && totalSiz > 1000) PAGE_SIZE = 200;
  else PAGE_SIZE = 500;

  return PAGE_SIZE;
}

module.exports = getPaginationPageSize;
