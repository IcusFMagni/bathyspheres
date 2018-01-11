var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool')
var constants = require('../modules/constants')

router.get('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT projects.id, projects.project_name, array_agg(collaborators.username) 
            FROM projects JOIN users 
            ON users.id = projects.creator 
            FULL OUTER JOIN projects_users_junction
            ON projects.id = projects_users_junction.project_id
            FULL OUTER JOIN users AS collaborators
            ON collaborators.id=projects_users_junction.user_id
            WHERE creator = $1
            GROUP BY projects.id;`,
                [req.user.id], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {

                        res.send(result.rows);
                    }
                });
        }
    });
});


router.get('/collaborator', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT users.username, projects.project_name, projects_users_junction.id
            FROM projects JOIN projects_users_junction 
            ON projects.id = projects_users_junction.project_id 
            JOIN users ON users.id = projects.creator
            WHERE projects_users_junction.user_id = $1;`,
                [req.user.id], function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        console.log('HERE ARE THE RESULTS', result.rows)
                        res.send(result.rows);
                    }
                });
        }
    });
});

router.delete('/collaborator', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`DELETE FROM projects_users_junction WHERE projects_users_junction.id = $1 AND projects_users_junction.user_id = $2;`,
                [req.query.track, req.user.id],
                function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);

                    }
                });

        }
    })
})

router.post('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`WITH new_track AS (INSERT INTO projects ("creator", "project_name")
            VALUES ($1, $2) RETURNING id) 
        INSERT INTO component ("component_name", "score", "project_id")
        VALUES ( 'bass', $3, (SELECT id FROM new_track)),
                ('synth', $4, (SELECT id FROM new_track)),
                ('kick', $5, (SELECT id FROM new_track));`,
                [req.user.id, req.query.name, constants.stringOf1792zeros, constants.stringOf1792zeros, constants.stringOf128zeros],
                function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                });

        }
    })
})

router.delete('/', function (req, res) {
    console.log('in DELETE', req.query)
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`DELETE FROM projects WHERE projects.project_name = $1 AND projects.creator = $2`,
                [req.query.track, req.user.id],
                function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);

                    }
                });

        }
    })
})

router.get('/tracks/:name', function (req, res) {
    var name = req.params.name

    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT * FROM component JOIN projects ON component.project_id=projects.id 
            WHERE projects.project_name = $1 ORDER BY component.id;`,
                [name],
                function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {

                        res.send(result.rows);
                    }
                });
        }
    });
})

router.put('/tracks', function (req, res) {
    pool.connect(function (err, client, done) {
        if (err) {
            console.log('Error connecting to database', err);
            res.sendStatus(500);
        } else {
            client.query(`UPDATE component as t1 SET score = $1
            FROM  projects as t2 WHERE t1.project_id=t2.id 
            AND t2.project_name = $2 AND t1.component_name = $3;`, [req.query.string, req.query.projectName, req.query.componentName], function (err, result) {
                    done()
                    if (err) {
                        res.sendStatus(500)
                    } else {
                        res.sendStatus(200)
                    }
                })
        }
    })
})


router.get('/user', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT users.id FROM users 
            WHERE users.username = $1;`,
                [req.query.user],
                function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {

                        res.send(result.rows);
                    }
                });
        }
    });
})

router.post('/user', function (req, res) {
    console.log(req.query.user, req.query.track)
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`INSERT INTO "projects_users_junction" ("user_id","project_id")
            VALUES ($1,$2);`,
                [req.body.user, req.body.track],
                function (errorMakingQuery, result) {
                    done();
                    if (errorMakingQuery) {
                        console.log('Error making query', errorMakingQuery);
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                    }
                });

        }
    })
})

module.exports = router;