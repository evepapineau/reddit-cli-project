var request = require('request');
var inquirer = require('inquirer');
var prompt = require('prompt');
var redditFunctions = require('./reddit');

var menuChoices = [
  {name: 'Show homepage', value: 'HOMEPAGE'},
  {name: 'Show subreddit', value: 'SUBREDDIT'},
  {name: 'List subreddits', value: 'SUBREDDITS'}
]


function displayPost(post) {
  console.log(post.data.title);
  console.log('https://reddit.com' + post.data.permalink);
  console.log('\n');
}

function requestAsJson(url, callback) {
  request(url, function (err, res) {
    if (err) {
      callback(err);
    }
    else {
      try {
        var data = JSON.parse(res.body);
        callback(null, data);
      }
      catch (err){
        callback(err);
      }  
    }
  })
}

function getHomepage(callback) {
  requestAsJson('https://reddit.com/.json', function(err, res) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, res.data.children);
    }
  });
}

function getSortedHomepage(sortingMethod) {
  request('https://www.reddit.com/' + sortingMethod + '/.json', function (err, result) {
    if (err) {
      console.log(err);
    }
    else {
      try {
        var data = JSON.parse(result.body);
        var sortingMethodData = data.data.children;
        console.log(sortingMethodData);
      }
      catch (err) {
        console.log(err);
      }
    }
  })
}

function getSubreddit(callback) {
  prompt.get('subreddit', function (err, res) {
    if (err) {
      callback(err);
    }
    else {
      var subredditAnswer = res.subreddit;
      request('https://www.reddit.com/r/' + subredditAnswer + '/.json', function(err, res) {
        if (err) {
          callback(err);
        }
        else {
          try {
            var data = JSON.parse(res.body);
            var subReddit = data.data.children;
            callback(null, subReddit)
          }
          catch (err) {
            callback(err);
          }
        }
      })
    }
  })
}

function getSortedSubreddit(subreddit, sortingMethod, callback) {
  request('https://www.reddit.com/r/' + subreddit + sortingMethod + '/.json', function (err, result){
    if (err) {
      callback(err);
    }
    else {
      try {
        var data = JSON.parse(result.body);
        var subRedditsortingMethod = data.data.children;
        console.log(subRedditsortingMethod);
      }
      catch (err) {
        callback(err);
      }
    }
  })
}

function getSubreddits(popularSubreddit, callback) {
  request('https://www.reddit.com/r/' + popularSubreddit + '/.json', function(err, result) {
    if (err) {
      callback(err);
    }
    else {
      try {
        var data = JSON.parse(result.body);
        var popularSubreddit = data.data.children;
        console.log(popularSubreddit);
      }
      catch (err) {
        callback(err);
      }
    }
  })
}

function mainMenu() {
  inquirer.prompt({
    type: 'list',
    name: 'menu',
    message: 'What do you want to do?',
    choices: menuChoices
  }).then(
    function(answers) {
      if (answers.menu === 'HOMEPAGE') {
        getHomepage(function(err, homepagePosts) {
          if (err) {
            console.log("There was an error " + err);
          }
          else {
            homepagePosts.forEach(displayPost);
            mainMenu();
          }
        });
      }
      else if(answers.menu === 'SUBREDDIT') {
        getSubreddit(function(err, subredditPosts) {
          if (err) {
            console.log("The was an error " + err);
          }
          else {
              subredditPosts.forEach(displayPost);
              mainMenu();
          }
        })
      }
      else if(answers.menu ==== 'SUBREDDITS') {
      }
    }
  );
}

mainMenu();

module.exports = {
  getHomepage: getHomepage
};
