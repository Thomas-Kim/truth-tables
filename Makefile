all:
	jison boolean_evaluate.jison -o js/libs/boolean_evaluate.js
	jison boolean_print.jison -o js/libs/boolean_print.js

run:
	make
	xdg-open index.html
