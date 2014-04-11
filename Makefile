all:
	jison boolean_evaluate.jison
	jison boolean_print.jison

run:
	make
	node boolean_evaluate.js test_evaluate.dat
	node boolean_print.js test_print.dat

clean:
	rm boolean_evaluate.js boolean_print.js
