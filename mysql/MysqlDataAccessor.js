
const pool = require('./Connection')



function insertHashTags(data) {

    return new Promise((resolve, reject) => {
    

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve({ id: results.insertId})
        }

        pool.query('insert into hash_tags set ?', data, callback);
    });

}

function insertTweets(data) {

     return new Promise((resolve, reject) => {
    

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve({ id: results.insertId })
        }

        pool.query('insert into tweets set ?', data, callback);
    });
 }

 function insertHashTagTweetMapping(data) {

    return new Promise((resolve, reject) => {
      

       const callback = (error, results, fields) => {
           if(error) {
               reject(error)
           }
           resolve({ id: results.insertId })
       }

       pool.query('insert into hash_tag_content_mapping set ?', data, callback);
   });
}

var data = {
    hash_tag_name: 'testing bro fds'
}
/*
var res = insertTweets(data);
res
.then(res => console.log(res))
.catch(error => console.log(error))
*/
// console.log("hello gowtham dude", JSON.stringify(res,null,2));

module.exports = {
    insertHashTags,
    insertTweets,
    insertHashTagTweetMapping
}