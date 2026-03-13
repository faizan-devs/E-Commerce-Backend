const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'A tour must have a name'],
            unique: true,
            trim: true,
            maxlength: [
                40,
                'A tour name must have less or equal then 40 character',
            ],
            minlength: [
                10,
                'A tour name must have more or equal then 10 character',
            ],
        },
        slug: String,
        duration: {
            type: Number,
            required: [true, 'A tour must have a duration'],
        },
        maxGroupSize: {
            type: Number,
            required: [true, 'A tour must have a group size'],
        },
        difficulty: {
            type: String,
            required: [true, 'A tour must have a difficulty'],
            enum: {
                values: ['easy', 'medium', 'difficult'],
                message: 'Difficulty is either: easy, medium or difficult',
            },
        },
        ratingsAverage: {
            type: Number,
            default: 3,
            min: [1, 'Rating must be 1 or above'],
            max: [5, 'Rating must be 5 or below'],
        },
        ratingsQuantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            required: [true, 'A tour must have a Price'],
        },
        priceDiscount: {
            type: Number,
            validate: {
                validator: function (val) {
                    return val < this.price;
                },
                message: 'Discount price ({VALUE}) be below regular price',
            },
        },
        summary: {
            type: String,
            trim: true,
            required: [true, 'A tour must have a summary'],
        },
        description: {
            type: String,
            trim: true,
            maxength: [
                500,
                'A tour summary must have less or equal than 500 character',
            ],
            minlength: [
                200,
                'A tour summary must have more or equal then 200 character',
            ],
        },
        imageCover: {
            type: String,
            required: [true, 'A tour must have a image cover'],
        },
        images: [String],
        createdAt: {
            type: Date,
            default: Date.now(),
            select: false,
        },
        startDates: [Date],
        secretTour: {
            type: Boolean,
            default: false,
        },
    },
    {
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

tourSchema.virtual('durationWeeks').get(function () {
    return this.duration / 7;
});

// DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function () {
    this.slug = slugify(this.name, { lower: true });
});

// tourSchema.pre('save', function (next) {
//     console.log('Will save document...');
// });

// tourSchema.post('save', function (doc, next) {
//     console.log(doc);
//     next();
// });

// QUERY MIDDLEWARE
tourSchema.pre(/^find/, function () {
    this.find({ secretTour: { $ne: true } });

    this.start = Date.now();
});

tourSchema.pre('findOneAndUpdate', function () {
    const update = this.getUpdate();
    if (update.name) {
        update.slug = slugify(update.name, { lower: true });
    }
});

tourSchema.post(/^find/, function (docs, next) {
    console.log(`Query took ${Date.now() - this.start} milliseconds`);
    next();
});

// AGGREGATION MIDDLEWARE
tourSchema.pre('aggregate', function () {
    this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });

    console.log(this.pipeline());
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
