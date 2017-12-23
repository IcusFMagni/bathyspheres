var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var pool = require('../modules/pool')

router.get('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {

            client.query(`SELECT projects.id, projects.username, projects.project_name, array_agg(collaborators.username) 
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

router.post('/', function (req, res) {
    pool.connect(function (errorConnectingToDatabase, client, done) {
        if (errorConnectingToDatabase) {
            console.log('Error connecting to database', errorConnectingToDatabase);
            res.sendStatus(500);
        } else {
            client.query(`INSERT INTO projects ("project_name", "creator") VALUES ($1, $2)`, [req.query.name, req.user.id], function (errorMakingQuery, result) {
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