// Sort Limit Skip Pgination function
function slsp(options) {
    const sort = {};
    if (options.sortBy) {
      const parts = options.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
    const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
    const skip = (page - 1) * limit;

    return { sort, limit, skip, page }
};

function arrayShow(array, limit, page) {  // limit: page_size, page: page_number
    const totalResults = array.length;
    const results = array.slice((page - 1) * limit, page * limit);
    const totalPages = Math.ceil(totalResults / limit);
    const result = {
      results,
      page,
      limit,
      totalPages,
      totalResults,
    };
    
    return result;
}

module.exports = { slsp, arrayShow };