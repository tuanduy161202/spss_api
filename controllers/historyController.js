const db = require('../utils/db');
var ObjectID = require('mongoose').Types.ObjectId;
const Document = db.Document;

exports.create = (req, res) => {
    const document = new Document({
      id: req.body.id,
      name: req.body.name,
      pages: req.body.pages,
      format: req.body.format,
      selected: req.body.selected,
  });
    document.save((err, res) => {
    if (err) {
        res.status(500).send({ status: 'fail', message: err });
        return;
    }
    res
        .status(200)
        .send({ status: 'success', message: 'Document was created successfully!' });
    });
};

exports.getAll = (req, res) => {
    Document.find({})
        .sort({ created_at: -1 })
        .then(documents => {
            res.status(200).send({ status: 'success', data: documents });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.getSelected = (req, res) => {
    Document.find({selected: true})
        .sort({ created_at: -1 })
        .then(documents => {
            res.status(200).send({ status: 'success', data: documents });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

exports.updateById = (req, res) => {
    const id = req.params._id;
    const updateData = {
        name: req.body.name,
        pages: req.body.pages,
        format: req.body.format,
        selected: req.body.selected,
        update_at: new Date()
    };
    Document.findByIdAndUpdate(id, updateData, { new: true })
        .then(updatedDocument => {
            if (!updatedDocument) {
                return res.status(404).send({ status: 'fail', message: 'Document not found' });
            }
            res.status(200).send({ status: 'success', data: updatedDocument });
        })
        .catch(err => {
            res.status(500).send({ status: 'fail', message: err });
        });
};

//exports.getAll = (req, res) => {
//  const ipp = parseInt(req.query.limit) || 15;
//  const curr = parseInt(req.query.page) || 0;
//  const orderBy = {};
//  if (req.query.orderBy) {
//    orderBy[req.query.orderBy] = req.query.orderBy === 'rating' ? -1 : 1;
//  } else {
//    orderBy['title'] = 1;
//  }
//  const query = {};
//  if (req.query.types) {
//    query['type_id'] = {
//      $in: req.query.types.split(','),
//    };
//  }
//  if (req.query.languages) {
//    query['language'] = {
//      $in: req.query.languages.split(','),
//    };
//  }
//  if (req.query.publishers) {
//    query['publisher'] = {
//      $in: req.query.publishers.split(','),
//    };
//  }
//  if (req.query.ratings) {
//    const minRating = Number(_min(req.query.ratings.split(',')));
//    query['rating'] = {
//      $gte: minRating,
//    };
//  }
//  Book.aggregate([
//    {
//      $lookup: {
//        from: 'comments',
//        localField: '_id',
//        foreignField: 'book_id',
//        as: 'comments',
//      },
//    },
//    {
//      $lookup: {
//        from: 'types',
//        localField: 'type_id',
//        foreignField: 'id',
//        as: 'types',
//      },
//    },
//    {
//      $addFields: {
//        rating_amount: { $size: '$comments' },
//        sum_stars: { $sum: '$comments.stars' },
//        rating: {
//          $cond: [
//            { $eq: [{ $size: '$comments' }, 0] },
//            0,
//            { $divide: [{ $sum: '$comments.stars' }, { $size: '$comments' }] },
//          ],
//        },
//      },
//    },
//    {
//      $match: query,
//    },
//    {
//      $project: {
//        comments: 0,
//        sum_stars: 0,
//      },
//    },
//    {
//      $sort: orderBy,
//    },
//    {
//      $facet: {
//        metadata: [{ $count: 'totalRecords' }],
//        books: [{ $skip: curr * ipp }, { $limit: ipp }],
//      },
//    },
//  ]).exec((err, data) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }

//    res.status(200).send({
//      status: 'success',
//      data: data[0],
//    });
//  });
//};
//exports.getAllBook = (req, res) => {
//  Book.find(
//    {
//      $query: {},
//      $orderby: {id: 1, title: 1}
//    }
//  ).exec((err, data) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }

//    res.status(200).send({
//      status: 'success',
//      data: data[0],
//    });
//  });
//};
//exports.getGood = (req, res) => {
//  const ipp = parseInt(req.query.limit) || 5;
//  const curr = parseInt(req.query.page) || 0;
//  Book.aggregate([
//    {
//      $lookup: {
//        from: 'comments',
//        localField: '_id',
//        foreignField: 'book_id',
//        as: 'comments',
//      },
//    },
//    {
//      $lookup: {
//        from: 'types',
//        localField: 'type_id',
//        foreignField: 'id',
//        as: 'types',
//      },
//    },
//    {
//      $addFields: {
//        rating_amount: { $size: '$comments' },
//        sum_stars: { $sum: '$comments.stars' },
//        rating: {
//          $cond: [
//            { $eq: [{ $size: '$comments' }, 0] },
//            0,
//            { $divide: [{ $sum: '$comments.stars' }, { $size: '$comments' }] },
//          ],
//        },
//      },
//    },
//    {
//      $project: {
//        comments: 0,
//        sum_stars: 0,
//      },
//    },
//    {
//      $sort: {
//        rating: -1,
//      },
//    },
//  ])
//    .skip(curr * ipp)
//    .limit(ipp)
//    .exec((err, books) => {
//      if (err) {
//        res.status(500).send({ status: 'fail', message: err });
//        return;
//      }

//      res.status(200).send({
//        status: 'success',
//        data: books,
//      });
//    });
//};

//exports.getById = (req, res) => {
//  Book.findOne({id: req.params.id}).exec((err, book) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    if (!book) {
//      res.status(404).send({ status: 'fail', message: 'Book not found' });
//      return;
//    }
//    Comment.find({ book_id: book._id }).exec((err, comments) => {
//      if (err) {
//        res.status(500).send({ status: 'fail', message: err });
//        return;
//      }
//      let sum_stars = 0;
//      for (let i = 0; i < comments.length; i++) {
//        sum_stars += comments[i].stars;
//      }
//      res.status(200).send({
//        status: 'success',
//        data: Object.assign(book.toObject(), {
//          rating_amount: comments.length,
//          rating: sum_stars / comments.length,
//        }),
//      });
//    });
//  });
//};

//exports.searchByName = (req, res) => {
//  const ipp = parseInt(req.query.limit) || 10;
//  const curr = parseInt(req.query.page) || 0;
//  Book.aggregate([
//    {
//      $search: {
//        index: 'title_author_publisher',
//        phrase: {
//          query: req.body.keyword,
//          path: ['title', 'author', 'publisher'],
//        },
//        count: {
//          type: "total"
//        }
//      },
//    },
//    {
//      $skip: ipp * curr
//    },
//    {
//      $limit: ipp
//    }
//  ])
//  .exec((err, books) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    if (!books) {
//      res.status(200).send({
//        status: 'success',
//        data: null,
//      });
//      return;
//    }
//    return res.status(200).send({
//      status: 'success',
//      data: books,
//    });
//  });
//};

//exports.getByType = (req, res) => {
//  Book.find({ type_id: req.params.type_id }).exec((err, book) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      data: book,
//    });
//  });
//};

//exports.addType = (req, res) => {
//  const type = new Type({
//    id: req.body.id,
//    name: req.body.name,
//  });
//  type.save((err, type) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res
//      .status(200)
//      .send({ status: 'success', message: 'Type was created successfully!' });
//  });
//};

//exports.removeType = (req, res) => {
//  Type.aggregate([
//    { $match: { _id: { $eq: new ObjectID(req.params.id) } } },
//    {
//      $lookup: {
//        from: 'books',
//        localField: 'id',
//        foreignField: 'type_id',
//        as: 'books',
//      },
//    },
//    {
//      $addFields: {
//        books_amount: { $size: '$books' },
//      },
//    },
//    {
//      $project: {
//        books: 0,
//      },
//    },
//  ]).exec((err, types) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    if (types[0].books_amount > 0) {
//      res.status(200).send({
//        status: 'fail',
//        message: "Can't delete a type contains books!",
//      });
//      return;
//    }
//    Type.remove({ _id: req.params.id }).exec((err) => {
//      if (err) {
//        res.status(500).send({ status: 'fail', message: err });
//        return;
//      }
//      res.status(200).send({
//        status: 'success',
//        message: 'Type was deleted',
//      });
//    });
//  });
//};

//exports.addPublisher = (req, res) => {
//  const publisher = new Publisher({
//    id: req.body.id,
//    name: req.body.name,
//  });
//  publisher.save((err, publisher) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Publisher was created successfully!',
//    });
//  });
//};

//exports.getAllPublishers = (req, res) => {
//  Publisher.find({}).exec((err, publishers) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({ status: 'success', data: publishers });
//  });
//};

//exports.addLanguage = (req, res) => {
//  const language = new Language({
//    id: req.body.id,
//    name: req.body.name,
//  });
//  language.save((err, language) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Language was created successfully!',
//    });
//  });
//};

//exports.getAllLanguages = (req, res) => {
//  Language.find({}).exec((err, languages) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({ status: 'success', data: languages });
//  });
//};

//exports.getAllTypes = (req, res) => {
//  Type.aggregate([
//    {
//      $lookup: {
//        from: 'books',
//        localField: 'id',
//        foreignField: 'type_id',
//        as: 'books',
//      },
//    },
//    {
//      $addFields: {
//        books_amount: { $size: '$books' },
//      },
//    },
//    {
//      $project: {
//        books: 0,
//      },
//    },
//  ]).exec((err, types) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({ status: 'success', data: types });
//  });
//};

//exports.comment = (req, res) => {
//  const comment = new Comment({
//    user_id: req.userId,
//    book_id: req.body.id,
//    content: req.body.content,
//    stars: req.body.stars,
//  });
//  comment.save((err, comment) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Comment was created successfully!',
//      data: comment,
//    });
//  });
//};

//exports.getAllComments = (req, res) => {
//  Comment.aggregate([
//    { $match: { book_id: { $eq: new ObjectID(req.params.id) } } },
//    {
//      $lookup: {
//        from: 'users',
//        localField: 'user_id',
//        foreignField: '_id',
//        as: 'detailUsers',
//      },
//    },
//    { $unwind: '$detailUsers' },
//    {
//      $project: {
//        'detailUsers.password': 0,
//        'detailUsers.username': 0,
//        'detailUsers.address': 0,
//        'detailUsers.birth': 0,
//        'detailUsers.phone': 0,
//      },
//    },
//    {
//      $sort: { updated_at: -1 }
//    }
//  ]).exec((err, comments) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }

//    res.status(200).send({
//      status: 'success',
//      data: comments,
//    });
//  });
//};

//exports.delete = (req, res) => {
//  Book.remove({ _id: req.params.id }).exec((err) => {
//    if (err) {
//      res.status(500).send({ status: 'fail', message: err });
//      return;
//    }
//    res.status(200).send({
//      status: 'success',
//      message: 'Book was deleted',
//    });
//  });
//};