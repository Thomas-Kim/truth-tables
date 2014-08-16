all:
	jison boolean_evaluate.jison -o js/libs/boolean_evaluate.js
	jison boolean_print.jison -o js/libs/boolean_print.js
	jison boolean_split.jison -o js/libs/boolean_split.js
	jison boolean_split_2.jison -o js/libs/boolean_split_2.js
	./greplace.sh 'Object\.getPrototypeOf\(this\)\.parseError;' 'function \(str, hash\) \{ exp_list = null; throw new Error\(str\); \};' 'js/libs/boolean_print.js'
run:
	make
	xdg-open index.html
