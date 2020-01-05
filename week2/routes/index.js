const router = require('express').Router();
const User = require('../models/list');
const mongoose = require('mongoose');

module.exports = function(app) {

    router.post('/register', (req, res) => {
        const content_id = 0;
        const username = req.body.username;
        const password=  req.body.password;
        console.log(username);

        const newUser = new User();
        newUser.username = username;
        newUser.password = password;

        newUser.save((err) => {
            if(err) console.log(err);
            return res.redirect('/');
        })
    });

    //해당 user의 연락처 불러오기
    router.get('/getcontact', (req, res) => {
        const username = req.query.username;
        console.log('get contact router');
        // console.log(req.query.username);
        User.find({username : username}, function(err, users) {
            if(users.length != 0) {
                res.send(users[0].contacts);
            } else {
                res.send('not existed');
            }
        });
    });

    //연락처 없으면 저장하고 있으면 보내기    
    router.post('/contact', (req, res) => {
        console.log('contact router');

        const content_id = 0;
        const username = req.body.username;
        const password = req.body.password;
        const contacts = req.body.contacts; //list로 들어옴

        console.log(req.body);
        console.log(req.body.contacts);

        if(contacts == null) {
            console.log('null contacts');
            User.find({username : username}, function(err, users) {
                if(users.length != 0) {
                    res.send(users[0].contacts);
                } else {
                    res.send(null);
                }
            });
        } else {
            // convert string to json object
            var tmp = contacts.substring(1, contacts.length-1);
            var objectStringArray = (new Function("return [" + tmp+ "];")());
            // console.log(objectStringArray);
            
            User.find({username : username}, function(err, users) {
                if(users.length == 0) { //해당 user가 없을 때
                    newUser = new User();
                    newUser.content_id = content_id;
                    newUser.username = username;
                    newUser.password = password;
                    newUser.contacts = objectStringArray;
                    
                    newUser.save((err) => {
                        if(err) console.log(err);
                        // console.log(newUser.contacts);
                        return res.send(newUser.contacts);
                    });

                } else{ //user가 있을 때 contact를 비교하면서 없는 것만 추가하기
                    
                    // if(users.contacts.size == objectStringArray.size) {
                    //     res.send(users.contacts);
                    // } else { 
                    // }
                    res.send(users[0].contacts);
                }
            });
        }
    });

    //갤러리 DB에 저장
    router.post('/gallery', (req, res) => {
        console.log('gallery router');

        const content_id = 0;
        const username = req.body.username;
        const paths = req.body.paths;
        console.log(req.body);
        console.log(req.body.paths);

        if(paths == null) {
            User.find({username : username}, function(err, users) {
                if(users.length != 0) {
                    res.send(users[0].paths);
                } else {
                    res.send(null);
                }
            });
        } else {
            // convert string to json object
            var tmp = paths.substring(1, paths.length-1);
            var objectStringArray = (new Function("return [" + tmp+ "];")());
            // console.log(objectStringArray);
            
            User.find({username : username}, function(err, users) {
                if(users.length == 0) { //해당 user가 없을 때
                    newUser = new User();
                    newUser.content_id = content_id;
                    newUser.username = username;
                    newUser.paths = objectStringArray;
                    
                    newUser.save((err) => {
                        if(err) console.log(err);
                        // console.log(newUser.contacts);
                        return res.send(newUser.paths);
                    });

                } else{ //user가 있을 때 
                    // console.log('existed user');
                    if(users.paths == undefined) {
                        User.findOneAndUpdate({username : username},
                            {$set: {paths: objectStringArray}}, 
                            {new: true},
                            function(err,user){
                                if(err){
                                    res.json({error :err}) ; 
                                } else{
                                    res.send(user.paths) ; 
                                }
                            });
                    } else {
                        res.send(users[0].paths);
                    }
                    
                }
            });
        }
    });

    //갤러리 보내기

    //문제 받은 것 저장하기
    router.post('/problem', (req, res) => {
        console.log('problem router');
        const problem = req.body.problem;
        const content_id = 1;

        User.find({problem : problem}, function(err, users) {
            if(users.length == 0) {
                newUser = new User();
                newUser.problem = problem;
                newUser.content_id = content_id;

                newUser.save((err) => {
                    if(err) console.log(err);
                    return res.send(newUser);
                });
            } else { //기존 db에 있는 문제

            }

        })
        
        
    });


    return router;
}


