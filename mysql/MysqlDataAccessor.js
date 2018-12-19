
const pool = require('./Connection')



function insertHashTags(data) {

    return new Promise((resolve, reject) => {
        const params = {
            id: data.id
        }

        const callback = (error, data, response) => {
            if(error) {
                reject(error)
            }
            resolve({ data, response.insertId})
        }

        pool.query('insert into hash_tags set ?', data, callback);
    });

}

function insertTweets(data) {

     return new Promise((resolve, reject) => {
    

        const callback = (error, data, response) => {
            if(error) {
                reject(error)
            }
            resolve({ data, response.insertId })
        }

        pool.query('insert into tweets set ?', data, callback);
    });
 }

 function insertHashTagTweetMapping(data) {

    return new Promise((resolve, reject) => {
      

       const callback = (error, data, response) => {
           if(error) {
               reject(error)
           }
           resolve({ data, response.insertId })
       }

       pool.query('insert into hash_tag_content_mapping set ?', data, callback);
   });
}