



var Set, SummaryTool, intersect_safe, process_summary, test;
var txt, txt2='', title='', content='', summary='';


Set = function(initial_data) {
  var item, _i, _len;
  if (initial_data == null) {
    initial_data = null;
  }
  this.content = {};
  this.length = 0;
  if (initial_data) {
    for (_i = 0, _len = initial_data.length; _i < _len; _i++) {
      item = initial_data[_i];
      this.add(item);
    }
  }
};

Set.prototype.add = function(item) {
  this.content[item] = true;
  this.length += 1;
};

Set.prototype.remove = function(item) {
  delete this.content[item];
  this.length -= 1;
};

Set.prototype.asArray = function() {
  var res, that, val, _i, _len, _ref;
  that = this;
  res = [];
  _ref = this.content;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    val = _ref[_i];
    console.log(val);
    res.push(val);
  }
  return res;
};

intersect_safe = function(a1, a2) {
  var ai, bi, result;
  ai = 0;
  bi = 0;
  result = new Array();
  while (ai < a1.length && bi < a2.length) {
    if (a1[ai] < a2[bi]) {
      ai++;
    } else if (a1[ai] > a2[bi]) {
      bi++;
    } else {
      result.push(a1[ai]);
      ai++;
      bi++;
    }
  }
  return result;
};

SummaryTool = function() {
  var that;
  that = this;
  that.split_content_to_sentences = function(content) {
    var result;
    content = content.split("\n").join(". ");
    result = content.split(". ");
    return result;
  };
  that.split_content_to_paragraphs = function(content) {
    return content.split("\n\n");
  };
  that.sentences_intersection = function(sent1, sent2) {
    var result, s1, s2;
    if (!sent1 || !sent2) {
      return 0;
    }
    if (typeof sent1 === "undefined" || typeof sent2 === "undefined") {
      return 0;
    }
    s1 = new Set(sent1.split(" "));
    s2 = new Set(sent2.split(" "));
    if ((s1.length + s2.length) === 0) {
      return 0;
    }
    result = intersect_safe(s1, s2).length / ((s1.length + s2.length) / 2);
    return result;
  };
  that.format_sentence = function(sentence) {
    var result;
    if (typeof sentence === "undefined") {
      return "";
    }
    result = sentence.replace(/\W+/g, '');
    return result;
  };
  that.get_sentences_ranks = function(content) {
    var i, j, n, num, row, score, sentences, sentences_dic, values, _i, _j, _k, _l;
    sentences = that.split_content_to_sentences(content);
    n = sentences.length;
    values = 
      function() {
        var _i, _results;
        _results = [];
        for (row = _i = 0; 0 <= n ? _i <= n : _i >= n; row = 0 <= n ? ++_i : --_i) {
          _results.push((function() {
            var _j, _results1;
            _results1 = [];
            for (num = _j = 0; 0 <= n ? _j <= n : _j >= n; num = 0 <= n ? ++_j : --_j) {
              _results1.push(0);
            }
            return _results1;
          })());
        }
        return _results;
    }();
    for (i = _i = 0; 0 <= n ? _i <= n : _i >= n; i = 0 <= n ? ++_i : --_i) {
      for (j = _j = 0; 0 <= n ? _j <= n : _j >= n; j = 0 <= n ? ++_j : --_j) {
        values[i][j] = that.sentences_intersection(sentences[i], sentences[j]);
      }
    }
    sentences_dic = {};
    for (i = _k = 0; 0 <= n ? _k <= n : _k >= n; i = 0 <= n ? ++_k : --_k) {
      score = 0;
      for (j = _l = 0; 0 <= n ? _l <= n : _l >= n; j = 0 <= n ? ++_l : --_l) {
        if (i === j) {
          continue;
        }
        score += values[i][j];
      }
      sentences_dic[that.format_sentence(sentences[i])] = score;
    }
    return sentences_dic;
  };
  that.get_best_sentence = function(paragraph, sentences_dic) {
    var best_sentence, max_value, s, sentences, strip_s, _i, _len;
    sentences = that.split_content_to_sentences(paragraph);
    if (sentences.length < 1) {
     return "";
    }
    best_sentence = "";
    max_value = 0;
    for (_i = 0, _len = sentences.length; _i < _len; _i++) {
      s = sentences[_i];
      strip_s = that.format_sentence(s);
      if (strip_s) {
        if (sentences_dic[strip_s] > max_value) {
          max_value = sentences_dic[strip_s];
          best_sentence = s;
        }
      }
    }
    return best_sentence;
  };

  that.get_summary = function(title, content, sentences_dic) {
    var p, paragraphs, sentence, summary, _i, _len;
    paragraphs = that.split_content_to_paragraphs(content);
    summary = [];
    // summary.push(title.trim());
    summary.push("");
    for (_i = 0, _len = paragraphs.length; _i < _len; _i++) {
      p = paragraphs[_i];
      sentence = that.get_best_sentence(p, sentences_dic).trim();
      if (sentence) {
        summary.push(sentence);
      }
    }
    return summary.join("\n");
  };
  return that;
};

test = function(title, content) {
  var content, sentences_dic, st, summary, title;
  st = SummaryTool();
  sentences_dic = st.get_sentences_ranks(content);
  summary = st.get_summary(title, content, sentences_dic);

 // console.log(title);
 //   console.log(content);

  //console.log(summary);

 // $("body").html(title+'<br>'+content+'<br><br>'+summary);
 // console.log("");
 // console.log("Original length ");
 // console.log(title.length + content.length);
 // console.log("summary length ");
 // console.log(summary.length);
 // console.log("summary ratio");
  return summary;
};

process_summary = function(title, content) {
  var efficiency, sentences_dic, st, summary;
  st = SummaryTool();
  sentences_dic = st.get_sentences_ranks(content);
  summary = st.get_summary(title, content, sentences_dic);
  efficiency = 100 - (100 * (summary.length / (title.length + content.length)));
  return {
    summary: summary,
    efficiency: efficiency
  };
};

