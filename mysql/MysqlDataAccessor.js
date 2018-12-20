
const pool = require('./Connection')



function insertHashTags(data) {

    return new Promise((resolve, reject) => {
        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve({ id: results.insertId })
        }
        

        pool.query('insert into hash_tags set ?', data, callback);
        
    });

}

function updateHashTag(data) {
    return new Promise((resolve, reject) => {
    

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve({id: results.insertId})
        }

      
        let query = pool.query('update hash_tags set ? where hash_tag_id='+data.hash_tag_id, data, callback);
        console.log(query.sql)
    });
}

function insertTweets(data) {

     return new Promise((resolve, reject) => {
    

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve({id: results.insertId})
        }

        pool.query('insert into tweets set ?', data, callback);
    });
 }

 function updateTweets(data) {
    return new Promise((resolve, reject) => {
    

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve({id: results.insertId})
        }

      
        pool.query('update tweets set ? where id='+data.id, data, callback);
        
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

function updateHashTagTweetMapping(data) {
    return new Promise((resolve, reject) => {
    

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve({id: results.insertId})
        }

      
        pool.query('update hash_tag_content_mapping set ? where id='+data.id, data, callback);
        
    });
}

function createNewReportId() {

    return new Promise((resolve, reject) => {
      

       const callback = (error, results, fields) => {
           if(error) {
               reject(error)
           }
           resolve(results.insertId )
       }
       var data = {
           report_name: 'live-ad-risk'
       }

       pool.query('insert into reports set ?', data, callback);
   });
}

function getAllReportsList() {
    return new Promise((resolve, reject) => {
      

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve(results )
        }
    
 
        pool.query('select * from reports order by report_creation_time desc', callback);
    });
}

function getAllHashTagsForReportIds(list) {
    return new Promise((resolve, reject) => {
      

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve(results )
        }
    var sql = '(';

    for(var i =0;i<list.length;i++) {
        sql+=data[i];
    }
    sql=sql+')';
 
        pool.query('select * from hash_tags where report_id in '+sql, callback);
    });
}

function getTweetsGivenHashTagId(hashTagId) {
    return new Promise((resolve, reject) => {
      

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve(results )
        }
       
 
        pool.query('select * from tweets where hash_tag_id='+hashTagId, callback);
    });
}

function getHashTagContentMappingGivenHashTagId(hashTagId) {
    return new Promise((resolve, reject) => {
      

        const callback = (error, results, fields) => {
            if(error) {
                reject(error)
            }
            resolve(results )
        }
       
 
        pool.query('select * from hash_tag_content_mapping where hash_tag_id='+hashTagId, callback);
    });
}

/*
var data = {
    hash_tag_id: 6032,
    total_sentiment_score: 20
}

var res = updateHashTag(data);
res
.then(res => console.log(res))
.catch(error => console.log(error))
*/

module.exports = {
    insertHashTags,
    insertTweets,
    insertHashTagTweetMapping,
    getHashTagContentMappingGivenHashTagId,
    getTweetsGivenHashTagId,
    getAllHashTagsForReportIds,
    getAllReportsList,
    updateHashTag,
    updateTweets,
    updateHashTagTweetMapping,
    createNewReportId
}