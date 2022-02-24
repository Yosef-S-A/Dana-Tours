const Tour = require("../models/tourModel");
exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name, price, ratingsAverage, summary, difficulty';
  next();
};

class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    // usage: uri?field_1[filter]=value_1
    const queryObj = { ...this.queryStr };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    this.query = this.query.find(JSON.parse(queryString));

    return this;
  }

  sort() {
    // usage: uri?sort=field_1,field_2
    if (this.queryStr.sort) {
      const sortBy = this.queryStr.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    // usage: uri?fields=field_1,field_2
    if (this.queryStr.fields) {
      const fields = this.queryStr.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select('-__v');
    }

    return this;
  }

  paginate() {
    // usage: uri?page=page_num&limit=item_per_page
    const page = this.queryStr.page * 1 || 1;
    const limit = this.queryStr.limit * 1 || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

exports.getAllTours = async (req, res) => {
  try {
    console.log(req.query);
    //EXECUTE QUERY
    const features = new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limitFields().paginate();
    const tours = await features.query;

    res.status(200).json({
      status: "success",
      results: tours.length,
      data: {
        tours
      }
    });
  } catch(err){
    res.status(404).json({
      status: 'fail',
      message: err
    })
  }
};


// get a tour by id
exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id)

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err){
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};


// post a new tour
exports.createTour = async (req, res) => {
  try{
      const newTour = await Tour.create(req.body);

      res.status(201).json({
        status: "success",
        data: {
          tour: newTour,
        },
      });
  } catch(err) {
    res.status(400).json({
      status: 'fail',
      message: err
    });
  }
};


// patching a tour
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true
    })
    res.status(200).json({
        status: "success",
        data: {
          tour
        },
      });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }

  
};

// deleting a tour
exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete (req.params.id);

    res.status(204).json({
      status: "success",
      data: null,
    });

  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
