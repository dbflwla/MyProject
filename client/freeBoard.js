Session.set('curPageNum', 1);
Session.set('search', null);

Router.route('/freeBoard', 'freeBoard');

Template.freeBoard.onCreated(function() {
  //1
  console.log('created');
});

Template.freeBoard.onRendered(function() {
  //3
  console.log('rendered');
  //$('.table > tbody > tr').click(function() {
  //  // row was clicked
  //  Router.go('/boardDetail', {_id: });
  //});
});

Template.freeBoard.helpers({
  likeColor: function() {
    // this에 현재 라인의 데이터가 들어있다.
    var curArticle = this;
    var me = Meteor.user();
    if(!me) {
      return 'info';
    }

    var curData = Likes.findOne({'user._id': me._id, 'article._id': curArticle._id});
    if(curData) {
      return 'warning';
    }
    else {
      return 'info';
    }
  },
  //2
  boards: function () {
    var total = Boards.find({}).fetch().length;
    var curCount = 10;

    var condition = Session.get('search')
    if (condition == null) {
      condition = {};
    }
    else {
      condition = {제목: {$regex: condition}}
    }
    return Boards.find(condition, {
      limit: curCount,
      skip: (curCount*Session.get("curPageNum")) - curCount
    });
  },
  isLogin: function() {
    if(Meteor.user() === null
      || Meteor.user() === undefined) {
      //execute
      return false;
    }
    else return true;
  }

});

Template.freeBoard.events({
  "click #btnSearch": function(evt, tmpL) {
    var word = $('#inpSearch').val();
    Session.set('search', word);

  },
  "click #Prev": function(evt, tmpL) {
    var pn = Session.get('curPageNum');
    if(parseInt(pn) <= 1) {
      return alert('첫페이지입니다.')
    }
    Session.set('curPageNum', --pn);
  },
  "click #Next": function(evt, tmpL) {
    var pn = Session.get('curPageNum');
    Session.set('curPageNum', ++pn);
  },
  "click #btnLike": function(evt, tmpl) {
    var user = Meteor.user();
    if(!user) {
      return alert('로그인을 해주세요.');
    }
    var obj = {};
    obj.user = user;
    obj.article = this;
    Likes.insert(obj);
  },
  //4
  "click #removeOneItem": function(event, template) {
    //console.log(this);
    //var count = $(e.target).attr('count');
    //var obj = Boards.findOne({글번호: parseInt(count)});
    if(confirm('정말 지우시겠습니까?')) {
      Boards.remove({
        _id: this._id
      });
    }
  }
});

