all:
	jison boolean_evaluate.jison -o js/libs/boolean_evaluate.js
	jison boolean_print.jison -o js/libs/boolean_print.js
	jison boolean_split.jison -o js/libs/boolean_split.js
	jison boolean_split_2.jison -o js/libs/boolean_split_2.js
	jison boolean_split_3.jison -o js/libs/boolean_split_3.js
	./greplace.sh 'Object\.getPrototypeOf\(this\)\.parseError;' 'function \(str, hash\) \{ exp_list = null; throw new Error\(str\); \};' 'js/libs/boolean_print.js'
	./greplace.sh 'var parser = \(function\(\)\{' 'var boolean_evaluate = \(function\(\)\{' 'js/libs/boolean_evaluate.js'
	./greplace.sh 'exports\.parser = parser;' 'exports\.parser = boolean_evaluate;' 'js/libs/boolean_evaluate.js'
	./greplace.sh 'exports\.Parser = parser.Parser;' 'exports\.Parser = boolean_evaluate.Parser;' 'js/libs/boolean_evaluate.js'
	./greplace.sh 'exports\.parse = function \(\) \{ return parser\.parse\.apply\(parser, arguments\); \};' 'exports.parse = function () { return boolean_evaluate.parse.apply(boolean_evaluate, arguments); };' 'js/libs/boolean_evaluate.js'
	./greplace.sh 'var parser = \(function\(\)\{' 'var boolean_split = \(function\(\)\{' 'js/libs/boolean_split.js'
	./greplace.sh 'exports\.parser = parser;' 'exports\.parser = boolean_split;' 'js/libs/boolean_split.js'
	./greplace.sh 'exports\.Parser = parser.Parser;' 'exports\.Parser = boolean_split.Parser;' 'js/libs/boolean_split.js'
	./greplace.sh 'exports\.parse = function \(\) \{ return parser\.parse\.apply\(parser, arguments\); \};' 'exports.parse = function () { return boolean_split.parse.apply(boolean_split, arguments); };' 'js/libs/boolean_split.js'
	./greplace.sh 'var parser = \(function\(\)\{' 'var boolean_split_2 = \(function\(\)\{' 'js/libs/boolean_split_2.js'
	./greplace.sh 'exports\.parser = parser;' 'exports\.parser = boolean_split_2;' 'js/libs/boolean_split_2.js'
	./greplace.sh 'exports\.Parser = parser.Parser;' 'exports\.Parser = boolean_split_2.Parser;' 'js/libs/boolean_split_2.js'
	./greplace.sh 'exports\.parse = function \(\) \{ return parser\.parse\.apply\(parser, arguments\); \};' 'exports.parse = function () { return boolean_split_2.parse.apply(boolean_split_2, arguments); };' 'js/libs/boolean_split_2.js'
	./greplace.sh 'var parser = \(function\(\)\{' 'var boolean_split_3 = \(function\(\)\{' 'js/libs/boolean_split_3.js'
	./greplace.sh 'exports\.parser = parser;' 'exports\.parser = boolean_split_3;' 'js/libs/boolean_split_3.js'
	./greplace.sh 'exports\.Parser = parser.Parser;' 'exports\.Parser = boolean_split_3.Parser;' 'js/libs/boolean_split_3.js'
	./greplace.sh 'exports\.parse = function \(\) \{ return parser\.parse\.apply\(parser, arguments\); \};' 'exports.parse = function () { return boolean_split_3.parse.apply(boolean_split_3, arguments); };' 'js/libs/boolean_split_3.js'
	./greplace.sh 'var parser = \(function\(\)\{' 'var boolean_print = \(function\(\)\{' 'js/libs/boolean_print.js'
	./greplace.sh 'exports\.parser = parser;' 'exports\.parser = boolean_print;' 'js/libs/boolean_print.js'
	./greplace.sh 'exports\.Parser = parser.Parser;' 'exports\.Parser = boolean_print.Parser;' 'js/libs/boolean_print.js'
	./greplace.sh 'exports\.parse = function \(\) \{ return parser\.parse\.apply\(parser, arguments\); \};' 'exports.parse = function () { return boolean_print.parse.apply(boolean_print, arguments); };' 'js/libs/boolean_print.js'
run:
	make
	xdg-open index.html
