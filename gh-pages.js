var ghpages = require('gh-pages');
var path = require('path');

ghpages.publish(path.join(__dirname, 'release/layaweb/1.0.0'), { push: false }, function(err) {
    if(err){
        console.log("push error")
    }else{
        console.log("push success")
    }
});