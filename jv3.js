var Set, SummaryTool, intersect_safe, process_summary, test;
var txt, txt2 = '',
  content = '',
  summary = '';


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
    content = content.replace(/\[\w\]|\[\d+\]/g, "");
    content = content.replace(/\?+/g, "?. ");
    content = content.replace(/\!+/g, "!. ");
    content = content.replace(/\. /g, ".. ");
    result = content.split(". ");
    return result;
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
    var i, j, n, num, row, score, sentences, sentences_dic, values, i, j, k, l;
    sentences = that.split_content_to_sentences(content);
    n = sentences.length;
    values =
      function() {
        var i, results;
        results = [];
        for (row = i = 0; n >= 0 ? i <= n : i >= n; row = (n >= 0 ? ++i : --i)) {
          results.push((function() {
            var j, results1;
            results1 = [];
            for (num = j = 0; n >= 0 ? j <= n : j >= n; num = (n >= 0 ? ++j : --j)) {
              results1.push(0);
            }
            return results1;
          })());
        }
        return results;
      }();
    for (i = 0; n >= 0 ? i <= n : i >= n; i = (n >= 0 ? ++i : --i)) {
      for (j = 0; n >= 0 ? j <= n : j >= n; j = (n >= 0 ? ++j : --j)) {
        values[i][j] = that.sentences_intersection(sentences[i], sentences[j]);
      }
    }
    sentences_dic = {};
    for (i = k = 0; n >= 0 ? k <= n : k >= n; i = (n >= 0 ? ++k : --k)) {
      score = 0;
      for (j = l = 0; n >= 0 ? l <= n : l >= n; j = (n >= 0 ? ++l : --l)) {
        if (i === j) {
          continue;
        }
        score += values[i][j];
      }
      sentences_dic[that.format_sentence(sentences[i])] = score;
    }
    return sentences_dic;
  };

  that.get_best_sentence = function(paragraph, sentences_dic, size) {
    var best_sentences = [],
      max_value, min_value, s, sentences, s1, s1_u, s2, i, j, k, len, min, prev;
    sentences = that.split_content_to_sentences(paragraph);
    if(size == 0){
      size = sentences.length/2;
      size = size.toFixed(0);
      console.log(size);
    }
    if (sentences.length < size) {

      return sentences.join('');
    }


    for (i = 0; size < sentences.length ? i < size : i < sentences.length; i++) {

      best_sentences.push(sentences[i]); // used to initialise best_sentences[]

    }



    for (j = size; j < sentences.length; j++) {

      s1 = that.format_sentence(sentences[j]); //s1 is the next sentence to compare
      var s3 = "";
      s3 = sentences[j];
      min_value = 99999;
      for (k = 0; k < size; k++) {

        s2 = that.format_sentence(best_sentences[k]); // s2 is kth element in the best_sentences array
        if (sentences_dic[s2] < min_value) {
          min_value = sentences_dic[s2];
          min = k;
          prev = s2;

        }
      }

      if (sentences_dic[s1] > sentences_dic[prev]) {

        best_sentences.splice(min, 1);
        best_sentences.splice(size - 1, 0, s3);
      }

    }

    best_sentences.join('');
    return best_sentences;
  };

  that.get_summary = function(content, sentences_dic, size) {
    var p, paragraphs, sentence, summary, i, len;
    summary = [];
    sentence = that.get_best_sentence(content, sentences_dic, size);
    if (sentence) {
      summary.push(sentence);
    }

    return summary.join("\n");
  };
  return that;
};

test = function(content, size) {
  var content, sentences_dic, st, summary = '';
  var content1 = content;
  st = SummaryTool();
  if (content.match(/\n+/g)) {
    console.log();
    content1 = content1.split(/\n+/g);

    for (var i = 0; i < content1.length; i++) {

      sentences_dic = st.get_sentences_ranks(content1[i] + '');
      summary = summary + st.get_summary(content1[i] + '', sentences_dic, size) + '\n\n';
      console.log(summary);
    }
  } else {


    sentences_dic = st.get_sentences_ranks(content);
    summary = st.get_summary(content, sentences_dic, size);

  }

  summary = summary.replace(".,", ". ")

  return summary;
};
