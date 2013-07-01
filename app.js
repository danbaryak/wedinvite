
/**
 * Module dependencies.
 */


var express = require('express')
    , routes = require('./routes')
    , user = require('./routes/user')
    , http = require('http')
    , path = require('path');

var ObjectID = require('mongodb').ObjectID;
var mongojs = require('mongojs');
var db = mongojs('wedinvite');
var people = db.collection('people');
var replies = db.collection('replies');
var app = express();
var mailer = require('./MailSender.js');

// all environments                             ß
app.set('port', process.env.PORT || 8080);
app.set('views', __dirname + '/public');
app.engine('jshtml', require('jshtml-express'));  // make sure you have installed
app.set('view engine', 'jshtml');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/assafdan1107', function(req, res) {
    res.render('index', { title : 'Express' });
});

app.get('/users', user.list);

var getPerson = function(id, callback) {
    people.findOne({ _id: new ObjectID(id)}, function(err, person) {
       callback(person);
    });
}

/**
 * Sends a test mail message
 */
app.get('/sendmail', function(req, res) {
    var personId = req.query.id;
    var sendTo = req.query.sendTo;
    getPerson(personId, function(person) {
        console.log(JSON.stringify(person));
        mailer.sendMail(person, sendTo);
        res.send('Ok');
    });
});

app.get('/people', function(req, res) {
    people.find(function(err, p) {
        res.send(p);
    });
});

app.post('/people', function(req, res) {
    console.log('post request with ' + JSON.stringify(req.body));
    var person = req.body;
    people.insert(person, function(err, results) {

        if (err) {
            throw err;
        }
        var result = results[0];
//        result._id = encodeURIComponent(result._id.id);
        res.send({
            success: true,
            data: results
        });
    });

});

app.get('/addtestdata', function(req, res) {
    people.insert([{
        name: 'Ran Meyerstein',
        email: 'ranm@gmail.com'
    },{
        name: 'Shahar Biron',
        email: 'shaharb@gmail.com'
    }], function(err, people) {
        res.send('OK');
    });
})

app.put('/people/:id', function(req, res) {
    console.log('put request with ' + JSON.stringify(req.body));
    var person = req.body;
    var pid = person._id;
    var pid = id = new ObjectID(person._id);
    delete person._id;

    people.update({_id: pid}, {$set: person}, function(err, results) {
        res.send({
            success: true,
            data: person
        });
    });
})

app.delete('/people/:id', function(req, res) {
    people.remove({_id: new ObjectID(req.params.id)}, function(err, doc){
        if(err) {
            res.send(err);
            return;
        }
        res.send();
    });
});

app.get('/rsvp', function(req, res) {
    var personId = req.query.id;
    getPerson(personId, function(person) {
        if (person) {
            res.locals({
                personId: person._id,
                personName: person.name,
                couple: person.couple,
                coupleName: person.coupleName,
                isFemale: person.isFemale

            });

            res.render('rsvp/rsvp');
        }
    });
});

app.get('/reply', function(req, res) {
    var personId = req.query.id;
    var num = req.query.num;
    console.log('number of arrivals for ' + personId + ' is ' + num);
    people.update({_id: new ObjectID(personId)}, { $set: { arriving: num, replied: true }}, function(err, doc) {
        if (err) {
            res.send('Error');
        } else {
            res.send('OK');
        }
    });

    replies.save({
        time: new Date().getTime(),
        personId: personId,
        arriving: num
    })
})

app.get('/stats', function(req, res) {
    map = function() {
        var invited = this.couple ? 2 : 1;
        if (this.toCount) {
            invited -= this.toCount;
        }
        var needsRide = this.needsRide ? invited : 0;
        var arriving = 0;
        if (this.replied && this.arriving) {
            arriving = eval(this.arriving);

            if (this.toCount) {
                arriving -= this.toCount;
            }
        }
        emit('invited', {sum: invited, arr: arriving, ride: needsRide});
    }
    reduce = function(key, values) {
        var reduced = { sum: 0, arr: 0 , ride: 0};
        values.forEach(function(value) {
            reduced.sum += value.sum;
            reduced.arr += value.arr;
            reduced.ride += value.ride;
        });
        return reduced;
    }

    people.mapReduce(map, reduce, {out: {inline: 1}}, function(err, results, stats) {
        if (err) {
            throw err;
        }
        res.send(results);
    });
});

http.createServer(app).listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});
