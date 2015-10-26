/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');
var app = express();
var conString = "postgres://postgres:discos@localhost/postgres";

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));


// original app.get routine
// app.get('/comments.json', function(req, res) {
//   fs.readFile('comments.json', function(err, data) {
//     res.setHeader('Cache-Control', 'no-cache');
//     res.json(JSON.parse(data));
//   });
// });

app.get('/', function(req, res) {
  console.log('GET requested');
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      if(!err) return false;
      if(client) {
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    if(handleError(err)) return;
    client.query('SELECT name, comment FROM comments', function(err, result){
      if(handleError(err)) return;
    });
      done();
      res.writeHead(200, {'content-type': 'text/plain'})
      console.log(results.rows);
      res.end(JSON.stringify(result.rows));
  })

});

app.post('/', function(req, res) {
  console.log('POST requested');
  pg.connect(conString, function(err, client, done) {
    var handleError = function(err) {
      if(!err) return false;
      if(client){
        done(client);
      }
      res.writeHead(500, {'content-type': 'text/plain'});
      res.end('An error occurred');
      return true;
    };
    if(handleError(err)) return;
    console.log(JSON.stringify(req.body.name) + ' ' + JSON.stringify(req.body.comment));
    client.query('INSERT INTO comments (name, comment) VALUES ($1, $2)', [JSON.stringify(req.body.name), JSON.stringify(req.body.comment)], function(err, result) {
      if(handleError(err)) return;
    });
  });
});


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
  

  // original routine cut from the app.post function
  // fs.readFile('comments.json', function(err, data) {
  //   var comments = JSON.parse(data);
  //   comments.push(req.body);
  //   fs.writeFile('comments.json', JSON.stringify(comments, null, 4), function(err) {
  //     res.setHeader('Cache-Control', 'no-cache');
  //     res.json(comments);
  //   });
  // });
