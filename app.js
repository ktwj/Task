// mysql://b9af421ed731e2:6121bd6e@us-cdbr-east-05.cleardb.net/heroku_2ad1200fa642094?reconnect=true

const express = require('express');
const csrf = require('csurf');
const session = require('express-session');
const ejs = require('ejs');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 4000;
const csrfProtection = csrf({ cookie: false });

app.set('views', './views');
app.set('view engine', 'ejs');
app.set('ejs', ejs.renderFile)

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: false
}));


const con = mysql.createConnection({
    host: 'us-cdbr-east-05.cleardb.net',
    user: 'b9af421ed731e2',
    password: '6121bd6e',
    database: 'heroku_2ad1200fa642094'
  });

app.get('/', (req, res) => {
    con.query('select * from users', function (err, results) {
        if (err) throw err
        res.render('index.ejs', { contents: results });
    });
})

app.get('/register',csrfProtection, (req,res) => {
    res.render('register.ejs',{csrfToken: req.csrfToken()});
});

app.post('/register', csrfProtection,(req,res) => {
    let sql = 'select * from users where  = ?';
    let ins = req.body.name;
    con.query(sql,ins,
        (err,results) => {
            console.log(results[0]);
            if(results[0] !== undefined) res.render('register.ejs', {fail:results,csrfToken: req.csrfToken() });
            else res.render('registerConfirm.ejs', { name:req.body.name, pass:req.body.pass , csrfToken: req.csrfToken()    });
        }
    )
});

app.get('/registerConfirm',csrfProtection , (req,res) => {
    res.render('registerConfirm.ejs', {name:req.name , pass:req.pass, csrfToken: req.csrfToken() });
});

app.post('/registerConfirm', (req,res) => {
    let sql = 'insert into users(id,name,pass) values(0,?,?)';
    let ins = [req.body.name, req.body.pass];
    try{
        con.query(sql,ins,
            (err, results) => {
                res.redirect('/')
            }
        );
    }catch(e){
        throw e;
    }
});

app.get('/id/:id',csrfProtection, (req,res) => {
    res.render('id.ejs', { params : req.params});
});

app.get('/login',csrfProtection, (req,res) => {
    res.render('login.ejs',{csrfToken: req.csrfToken()});
});

app.post('/login',csrfProtection, (req, res) => {
    let sql ='select * from users where name = ? and pass = ?';
    let ins = [req.body.name, req.body.pass];
    con.query(sql,ins,
        (err, results) => {
            if (err)  res.render('login.ejs', {fail:results, csrfToken: req.csrfToken()} );
            if(typeof results[0] !== 'undefined') res.render('login.ejs', {contents:results, csrfToken: req.csrfToken()});
            else res.render('login.ejs', {fail:results, csrfToken: req.csrfToken()} );
        }
    );
});

app.get('/post', (req,res) => {
    let sql = 'select * from categorys where deleted_at is null';
    con.query(sql,
        (err,categorys) => {
            if(err) throw err;
             res.render('post.ejs', { categorys : categorys});
        }
    );
});

app.post('/post', (req,res) => {
    sql = 'select * from categorys where deleted_at is null';
    con.query(sql,
        (err,categorys) => {
            if(err) throw err;
             res.render('postConfirm.ejs', { posts : req.body , categorys:categorys});
        });
});

app.post('/postConfirm', (req,res) => {
    let sql = 'insert into posts(date, place, work, category_id, progress, user_id) values(?,?,?,?,?,?);';
    let ins = [req.body.date, req.body.place, req.body.work, req.body.category_id, req.body.progress, req.body.user_id];
    con.query(sql,ins,
        (err, results) => {
            if(err) throw err;
            const insertId = results.insertId;

            sql = 'insert into category_posts(post_id, category_id) values(?,?)';
            ins = [insertId, req.body.category_id];
            con.query(sql,ins,
                (err,results) => {
                    if(err) throw err;
                    res.redirect('/');
                }
            );
        });
    
});

app.get('/list', (req,res) => {
    let sql = 'select * from posts where deleted_at is null';
    con.query(sql,
        (err,results) => {
            if(err) throw  err;

            sql = 'select * from categorys where deleted_at is null';
            con.query(sql, 
                (err,categorys) => {
                    if(err) throw err;

                    sql = 'select id,name from users where deleted_at is null'
                    con.query(sql,
                        (err,users) => {
                            if(err) throw err;
                            res.render('list.ejs', { contents : results , categorys:categorys , users: users});
                        }
                    );
                }
            );

        });
});

app.post('/list',(req,res)=>{
    let sql = 'select * from posts where deleted_at is null '
    let ins = [];
    if(req.body.place != '') {sql +='and place like ? '; ins.push(`%${req.body.place}%`);};
    if(req.body.work != '') {sql += 'and work like ? '; ins.push(`%${req.body.work}%`);};
    if(req.body.category_id != 0) {sql += 'and category_id=? ';ins.push(req.body.category_id);};
    if(req.body.progress != 0) {sql += 'and progress=? ';ins.push(req.body.progress);};
    sql += ';';

    
    con.query(sql,ins,
        (err,results) => {
            if(err) throw err;

            sql = 'select * from categorys where deleted_at is null';
            con.query(sql, 
                (err,categorys) => {
                    if(err) throw err;

                    sql = 'select id,name from users where deleted_at is null'
                    con.query(sql,
                        (err,users) => {
                            if(err) throw err;
                            res.render('list.ejs', { contents : results , categorys:categorys , users: users, old:req.body});
                    });
            });
    });
});

app.get('/:id/delete', csrfProtection, (req,res) => {
    let sql = 'select * from posts where deleted_at is null and id =?';
    let ins = req.params.id;
    con.query(sql,ins,
        (err,results) => {
            if(err) throw err;

            sql = 'select * from categorys where deleted_at is null';
            con.query(sql, 
                (err,categorys) => {
                    if(err) throw err;
                    res.render('deleteConfirm.ejs', {contents : results, id: ins , categorys:categorys});
                });
        }
    );
});

app.post('/deleteConfirm', (req,res) => {
    let sql = 'Update posts Set updated_at=?, deleted_at=? where id=?';
    let now = getTime();
    let ins = [now, now, req.body.id];
    con.query(sql,ins,
        (err, results) => {
            if(err) throw err;
            res.redirect('/list');
        }
    );
});

app.get('/:id/edit', csrfProtection, (req,res) => {
    let sql = 'select * from posts where deleted_at is null and id =?';
    let ins = req.params.id;
    con.query(sql,ins,
        (err,results) => {
            if(err) throw err;
            
            sql = 'select * from categorys where deleted_at is null';
            con.query(sql, 
                (err,categorys) => {
                    if(err) throw err;
                    res.render('edit.ejs', {contents : results, id: ins , categorys:categorys});
                });
        }
    );
});

app.post('/:id/edit', (req,res) => {
    let sql = 'update category_posts set deleted_at=? where id=?';
    let now = getTime();
    let ins = [now, req.params.id];
    con.query(sql,ins,
        (err, results) => {
            if(err) throw err;

            let sql = 'Update posts Set date=?, place=?, work=?, category_id=?, progress=? where id=?';
            let ins = [req.body.date, req.body.place, req.body.work, req.body.category, req.body.progress, req.body.id];
            con.query(sql,ins,
                (err, results) => {
                    if(err) throw err;

                    let sql = 'insert into category_posts(post_id, category_id) value(?,?)'
                    let ins = [req.params.id, req.body.category];
                    con.query(sql,ins,
                        (err, results) => {
                            if(err) throw err;

                            res.redirect('/list');
                    });
            });
    });
});

app.get('/logout',csrfProtection, (req, res) => {
    res.render('logout.ejs');
});

app.get('/top',csrfProtection, (req,res) => {
    res.render('top.ejs');
});

app.listen(port , ()=>{
    console.log('server listened by port ' + String(port) + ' ...');
 });

app.get('/test',(req,res)=>{
    res.render('test.ejs');
})
function getTime(){
    var dt = new Date();
    var timestamp = dt.getFullYear()+
    (String(dt.getMonth()+101).substr(1,2))+
    (String(dt.getDate()+100).substr(1,2)+
    (String(dt.getHours()+100).substr(1,2))+
    (String(dt.getMinutes()+100).substr(1,2))+
    (String(dt.getSeconds()+100).substr(1,2)));
    timestamp.match(/(d{4})(d{2})(d{2})(d{2})(d{2})(d{2})/);
    var datetime = RegExp.$1+'-'+RegExp.$2+'-'+RegExp.$3+' '+RegExp.$4+':'+RegExp.$5+':'+RegExp.$6;
    return timestamp;
}